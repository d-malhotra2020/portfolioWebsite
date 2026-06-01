## The hook

An operator-console dashboard for a **simulated** home-automation system — with one honest piece of real infrastructure bolted on: a genuine MQTT broker round-trip. Device state is simulated in SQLite, but when a broker is configured, every mutation publishes to it and an external client can drive devices back through topic commands. The point of the project wasn't to wire up a house; it was to build the pub/sub plumbing correctly and make the UI tell the truth about what's real and what's simulated.

## Architecture

```text
   +-------------------------+
   |  Single-file web UI     |   operator-terminal aesthetic
   |  (index.html + WS)      |   real-time via WebSocket
   +-----------+-------------+
               |  Flask-SocketIO (push, no polling)
               v
   +-------------------------+        +--------------------------+
   |  Flask command center   |<------>|  SQLite                  |
   |  device_controller.py   |        |  Device / Room state     |
   |  + sensor sim loop      |        |  (mutated server-side)   |
   +-----------+-------------+        +--------------------------+
               |
               |  paho-mqtt (graceful degradation)
               v
   +-------------------------+
   |  Mosquitto 2.0 broker   |   optional sidecar
   |  home/devices/<id>/...  |   pip = "offline · sim" until
   +-------------------------+   a real connection establishes
```

When `MQTT_HOST` is set and reachable, every device mutation publishes to `home/devices/<id>/state` (retained), and the app subscribes to `home/devices/+/command` — so an external MQTT client can toggle a device or set its brightness and watch the UI update through a real broker round-trip. Without a broker, the app runs in sim mode and the broker pip stays grey.

## What's real vs. simulated

The UI says this out loud, via a `// system reality` footer at the bottom of the page:

- **Simulated:** all device state (lights, sensors, climate) lives in SQLite and is mutated server-side. No physical fixtures are wired.
- **Real:** the MQTT round-trip. With a broker configured, device mutations genuinely publish, and external commands genuinely drive devices.
- **Honest degradation:** the broker pip is labelled `offline · sim` until a real connection is established — it only flips to `live` when one is.

I built it this way deliberately. The default move for a hobby IoT project is to claim a rack of sensors and a percentage of energy saved. This one ships the broker plumbing for real and is transparent about everything it doesn't have.

## Key decisions

**Simulate the fleet, but make the broker real.** Physical sensors weren't the lesson — pub/sub semantics were (retained messages, topic schemas, partition recovery). Simulating the devices let me exercise all of that without a closet full of hardware, and the round-trip is real enough to drive from a third-party `mosquitto_pub` in another terminal.

**Honest degradation over faking a connection.** The hard part of "graceful degradation" is resisting the urge to fake success. The `mqtt_client.py` wrapper reports the broker's actual state, and the UI surfaces it. A grey pip that says `offline · sim` is more useful than a green one that's lying.

**Flask + SocketIO over polling.** A single state change broadcasts to every connected client over WebSocket — the UI updates without polling. For a system this size, that's the whole win.

**SQLite for state.** One file, server-side mutation, no extra process to monitor. The system handles a house's worth of traffic with room to spare.

## What I'd do differently

**Wire one real device.** The architecture is built for it — the command subscription already exists. A single real relay subscribing to `home/devices/<id>/command` would turn one column of the `// system reality` table from "simulated" to "real" without changing the app.

**Tests for the sim loop.** The sensor simulation loop is the least-covered part of the code. It's deterministic enough to test; I just haven't.

## Stack

Python 3.9, Flask 2.3, Flask-SocketIO 5.3, paho-mqtt 1.6, SQLite, eventlet. Eclipse Mosquitto 2.0 as an optional broker sidecar. Single-file `index.html` UI (Geist Sans + JetBrains Mono via CDN, WebSocket for real-time updates). Deployed on Railway — Flask via Nixpacks, Mosquitto as a separate service over private networking.
