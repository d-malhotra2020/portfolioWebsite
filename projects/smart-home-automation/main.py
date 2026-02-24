#!/usr/bin/env python3
"""
Smart Home Automation System
Main application entry point
"""

import os
import sys
from app import create_app
from app.web_interface import setup_routes

def main():
    """Main application function"""
    print("🏠 Starting Smart Home Automation System...")
    
    # Create Flask app and SocketIO
    app, socketio = create_app()
    
    # Setup routes and device controller
    controller = setup_routes(app, socketio)
    
    print("✅ System initialized successfully!")
    print("📱 Web interface available at: http://localhost:5000")
    print("🔧 Features:")
    print("   • Automated lighting control")
    print("   • Climate control system")  
    print("   • Security monitoring")
    print("   • Real-time sensor data")
    print("   • Energy usage tracking")
    print("\n🚀 Starting web server...")
    
    try:
        # Run the application
        socketio.run(
            app, 
            host='0.0.0.0', 
            port=5000, 
            debug=True, 
            allow_unsafe_werkzeug=True
        )
    except KeyboardInterrupt:
        print("\n🛑 Shutting down Smart Home System...")
        controller.stop_sensor_simulation()
        print("✅ System shutdown complete.")
    except Exception as e:
        print(f"❌ Error starting system: {e}")
        sys.exit(1)

if __name__ == '__main__':
    main()