import React, { useRef, useEffect, useState } from 'react'

const VideoBackground = () => {
  const videoRef = useRef(null)
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0)
  
  const videos = [
    '/VideoFiles/rocket_launch.mp4',
    '/VideoFiles/satellite.mp4', 
    '/VideoFiles/CIA.mp4',
    '/VideoFiles/hubble_telescope.mp4',
    '/VideoFiles/codingprogramming.mp4',
    '/VideoFiles/coding.mp4',
    '/VideoFiles/algorithm.mp4'
  ]

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    const handleVideoEnd = () => {
      setCurrentVideoIndex(prev => (prev + 1) % videos.length)
    }

    video.addEventListener('ended', handleVideoEnd)
    
    // Set initial source and play
    video.src = videos[currentVideoIndex]
    video.play().catch(e => console.log('Video autoplay blocked:', e))

    return () => {
      video.removeEventListener('ended', handleVideoEnd)
    }
  }, [currentVideoIndex, videos])

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    // Update video source when index changes
    video.src = videos[currentVideoIndex]
    video.play().catch(e => console.log('Video play error:', e))
  }, [currentVideoIndex, videos])

  useEffect(() => {
    // Parallax effect
    const handleScroll = () => {
      const video = videoRef.current
      if (video) {
        const scrolled = window.pageYOffset
        const parallax = scrolled * 0.5
        video.style.transform = `translate(-50%, -50%) translateY(${parallax}px)`
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <video
      ref={videoRef}
      className="video-background"
      autoPlay
      muted
      playsInline
      style={{
        position: 'fixed',
        top: '50%',
        left: '50%',
        minWidth: '100%',
        minHeight: '100%',
        width: 'auto',
        height: 'auto',
        transform: 'translate(-50%, -50%)',
        zIndex: -1,
        objectFit: 'cover',
        opacity: 0.3
      }}
    />
  )
}

export default VideoBackground