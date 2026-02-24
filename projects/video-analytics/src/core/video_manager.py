import asyncio
import cv2
import numpy as np
from typing import Dict, List, Optional, Tuple
import logging
from datetime import datetime
from dataclasses import dataclass
import threading
import queue

logger = logging.getLogger(__name__)

@dataclass
class CameraStream:
    id: str
    name: str
    url: str
    location: str
    status: str = "offline"
    fps: int = 30
    resolution: Tuple[int, int] = (1920, 1080)
    last_frame_time: Optional[datetime] = None
    detection_enabled: bool = True

@dataclass 
class VideoFrame:
    camera_id: str
    timestamp: datetime
    frame: np.ndarray
    frame_id: int
    metadata: Dict = None

class VideoStreamManager:
    """Manages multiple video streams and frame processing"""
    
    def __init__(self):
        self.streams: Dict[str, CameraStream] = {}
        self.active_captures: Dict[str, cv2.VideoCapture] = {}
        self.frame_queues: Dict[str, queue.Queue] = {}
        self.processing_threads: Dict[str, threading.Thread] = {}
        self.is_running = False
        self.processing_fps = 10
        self.max_streams = 500
        
    async def initialize(self):
        """Initialize video stream manager"""
        logger.info("🎥 Initializing Video Stream Manager...")
        
        # Create mock camera streams
        await self._create_mock_streams()
        
        self.is_running = True
        logger.info(f"✅ Initialized {len(self.streams)} camera streams")
    
    async def _create_mock_streams(self):
        """Create mock camera streams for demonstration"""
        locations = [
            "Building A - Entrance", "Building A - Lobby", "Building A - Parking",
            "Building B - Entrance", "Building B - Hallway", "Building B - Exit",
            "Perimeter - North Gate", "Perimeter - South Gate", "Perimeter - East Fence",
            "Warehouse - Loading Dock", "Warehouse - Storage Area", "Office - Reception"
        ]
        
        # Create multiple streams per location to reach 500+ streams
        stream_count = 0
        for i in range(50):  # 50 locations
            for j in range(10):  # 10 cameras per location
                location = locations[i % len(locations)]
                camera = CameraStream(
                    id=f"cam_{stream_count:04d}",
                    name=f"Camera {stream_count + 1}",
                    url=f"rtsp://demo-camera-{stream_count}.local/stream",
                    location=f"{location} - Zone {j + 1}",
                    status="online",
                    fps=30,
                    resolution=(1920, 1080),
                    detection_enabled=True
                )
                
                self.streams[camera.id] = camera
                self.frame_queues[camera.id] = queue.Queue(maxsize=30)
                stream_count += 1
        
        logger.info(f"Created {stream_count} mock camera streams")
    
    async def get_stream_count(self) -> int:
        """Get total number of active streams"""
        return len([s for s in self.streams.values() if s.status == "online"])
    
    async def get_camera_status(self, camera_id: str) -> Optional[Dict]:
        """Get status information for a specific camera"""
        if camera_id not in self.streams:
            return None
            
        stream = self.streams[camera_id]
        return {
            "id": stream.id,
            "name": stream.name,
            "location": stream.location,
            "status": stream.status,
            "fps": stream.fps,
            "resolution": stream.resolution,
            "detection_enabled": stream.detection_enabled,
            "last_frame_time": stream.last_frame_time.isoformat() if stream.last_frame_time else None
        }
    
    async def start_detection(self, camera_id: str) -> bool:
        """Start detection on a specific camera"""
        if camera_id in self.streams:
            self.streams[camera_id].detection_enabled = True
            logger.info(f"Started detection on camera {camera_id}")
            return True
        return False
    
    async def stop_detection(self, camera_id: str) -> bool:
        """Stop detection on a specific camera"""
        if camera_id in self.streams:
            self.streams[camera_id].detection_enabled = False
            logger.info(f"Stopped detection on camera {camera_id}")
            return True
        return False
    
    async def get_all_streams(self) -> List[Dict]:
        """Get information about all streams"""
        return [
            {
                "id": stream.id,
                "name": stream.name,
                "location": stream.location,
                "status": stream.status,
                "detection_enabled": stream.detection_enabled
            }
            for stream in self.streams.values()
        ]
    
    async def process_streams(self):
        """Process video frames from all active streams"""
        # Simulate processing by updating stream timestamps
        active_streams = [s for s in self.streams.values() if s.status == "online"]
        
        # Process a sample of streams each iteration
        sample_size = min(50, len(active_streams))
        import random
        sample_streams = random.sample(active_streams, sample_size)
        
        for stream in sample_streams:
            # Simulate frame processing
            stream.last_frame_time = datetime.now()
            
            # Create mock frame data
            mock_frame = VideoFrame(
                camera_id=stream.id,
                timestamp=datetime.now(),
                frame=np.zeros((stream.resolution[1], stream.resolution[0], 3), dtype=np.uint8),
                frame_id=getattr(stream, '_frame_counter', 0) + 1,
                metadata={
                    "location": stream.location,
                    "fps": stream.fps,
                    "resolution": stream.resolution
                }
            )
            
            # Update frame counter
            setattr(stream, '_frame_counter', mock_frame.frame_id)
            
            # Add to processing queue if detection is enabled
            if stream.detection_enabled:
                try:
                    self.frame_queues[stream.id].put_nowait(mock_frame)
                except queue.Full:
                    # Remove oldest frame if queue is full
                    try:
                        self.frame_queues[stream.id].get_nowait()
                        self.frame_queues[stream.id].put_nowait(mock_frame)
                    except queue.Empty:
                        pass
    
    def get_frame_for_processing(self, camera_id: str) -> Optional[VideoFrame]:
        """Get next frame for processing from a specific camera"""
        if camera_id not in self.frame_queues:
            return None
            
        try:
            return self.frame_queues[camera_id].get_nowait()
        except queue.Empty:
            return None
    
    async def get_stream_statistics(self) -> Dict:
        """Get processing statistics"""
        online_streams = len([s for s in self.streams.values() if s.status == "online"])
        offline_streams = len(self.streams) - online_streams
        
        total_frames_processed = sum(
            getattr(stream, '_frame_counter', 0) 
            for stream in self.streams.values()
        )
        
        return {
            "total_streams": len(self.streams),
            "online_streams": online_streams,
            "offline_streams": offline_streams,
            "detection_enabled_streams": len([
                s for s in self.streams.values() 
                if s.detection_enabled and s.status == "online"
            ]),
            "total_frames_processed": total_frames_processed,
            "processing_fps": self.processing_fps,
            "average_queue_size": sum(
                queue.qsize() for queue in self.frame_queues.values()
            ) / len(self.frame_queues) if self.frame_queues else 0
        }
    
    async def cleanup(self):
        """Cleanup video stream resources"""
        logger.info("🧹 Cleaning up video stream manager...")
        
        self.is_running = False
        
        # Close all video captures
        for capture in self.active_captures.values():
            if capture.isOpened():
                capture.release()
        
        # Stop all processing threads
        for thread in self.processing_threads.values():
            if thread.is_alive():
                thread.join(timeout=1)
        
        # Clear queues
        for frame_queue in self.frame_queues.values():
            while not frame_queue.empty():
                try:
                    frame_queue.get_nowait()
                except queue.Empty:
                    break
        
        logger.info("✅ Video stream manager cleanup complete")