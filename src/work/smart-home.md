## The hook

A self-built home automation system running on a Raspberry Pi 4 in a closet, integrating 15+ sensors and actuators via MQTT, with a Flask command center and a sub-500ms control latency budget. The interesting part isn't the features — it's that I built it because I wanted to learn IoT failure modes hands-on, and the project shipped with an explicit "what breaks when you lose Wi-Fi" story.

## Architecture

```text
   +------------------+         +------------------+
   |   Mobile UI      |         |   Voice control  |
   |   (React PWA)    |         |   (Picovoice on  |
   |                  |         |    a USB mic)    |
   +--------+---------+         +--------+---------+
            |                            |
            +-------------+--------------+
                          |  HTTPS (local LAN)
                          v
                  +---------------+
                  |   Flask API   |    <-- the command center
                  |  (Raspberry   |        runs as a systemd unit
                  |   Pi 4, 8GB)  |        on boot
                  +-------+-------+
                          |
                          |  MQTT (Mosquitto broker, also local)
                          v
   +----------+----------+----------+----------+----------+
   | sensor 1 | sensor 2 | switch A | switch B | climate  |   ... 15+ devices
   | (DHT22)  | (PIR)    | (relay)  | (smart   | (sensor  |
   |          |          |          |  bulb)   |  array)  |
   +----------+----------+----------+----------+----------+

   State / events / settings:  SQLite on the Pi
```

Everything lives on the LAN. No cloud dependency. If the upstream internet dies, the lights still turn on.

## Key decisions

**Local-first over cloud-first.** Most consumer smart-home platforms (SmartThings, Google Home, even most Hue setups) tie control through a cloud relay. That means an upstream outage takes down your lightbulbs. I built this entirely on a local Mosquitto MQTT broker so the failure mode is bounded to "if the Pi dies, things stop." That's a failure mode I can fix by power-cycling a device sitting on a shelf. Cloud failure modes are not.

**MQTT over HTTP per device.** I considered REST endpoints on each device — simpler mental model, every sensor is just an HTTP server. MQTT won on two axes: pub/sub means a single state change broadcasts to all subscribers (the mobile UI updates without polling) and the broker handles the network-partition recovery I'd otherwise have to write per-device. The tradeoff was learning MQTT topics + retain semantics, but the cost was a few hours of reading and the payoff was no polling logic anywhere in the codebase.

**Flask not FastAPI.** This is a small system. I wanted something boring, with the smallest possible surface area, that I could read top-to-bottom in an afternoon. FastAPI's async overhead would have bought me nothing — the bottleneck is MQTT round-trips, not request handling. Default to the boring choice.

**SQLite for state, not Redis.** Same logic. The system handles <10 reqs/sec at peak (it's a house). SQLite handles that with room to spare and produces a single file I can rsync off the device for backups. Redis would have added a process to monitor and nothing else.

**Picovoice for offline voice.** I tried building this against an Alexa Skill first. It worked, but every voice command went through Amazon's cloud, which (a) introduced latency I couldn't see into and (b) meant every voice interaction in my house was leaving the LAN. Picovoice runs the wake-word + intent detection on-device. The total stack now has no external dependency for the headline features.

## What it cost me

- **30% energy savings** measured against the prior 6 months of utility bills, primarily from smarter heating/cooling schedules + occupancy-aware lighting
- **<500ms p95 latency** from voice command issued to relay fired, measured across 200 randomized scripted tests
- **15 devices** integrated (4 sensors, 6 switches, 3 smart bulbs, 1 USB camera, 1 occupancy sensor at the door)
- A weekend per device on the first ones, dropping to an hour or two each by device 10 as I'd built the right abstractions

## What I'd do differently

**Skip the mobile PWA, lean into voice + automation.** I built a custom React PWA for the mobile UI because "you need an app." In practice I use the voice control 90% of the time and the automations (sun-down dim, occupancy-driven lights) the other 10%. The PWA is overbuilt for how I actually use the system.

**Adopt Home Assistant for the integration layer.** I rolled my own Flask + MQTT setup because I wanted to learn the failure modes. I learned them. The cost was building integrations for every device individually. If I were starting today, I'd run Home Assistant on the Pi for device integration and write my own Flask layer only for the bespoke pieces (the occupancy-driven automation logic, the voice intent mapping). Roughly: stop building infrastructure I won't write blog posts about.

**Instrument better from day one.** I added Prometheus + Grafana six months in, after a sensor started flapping and I had no visibility. The first week of debugging would have been ten minutes with proper instrumentation. Lesson — even hobby projects benefit from observability before they need it.

## Stack

Python (Flask + paho-mqtt), Raspberry Pi 4 (8GB, headless Raspberry Pi OS), Mosquitto MQTT broker, SQLite, Picovoice (offline voice), React PWA for mobile UI, systemd for process management, Prometheus + Grafana for the late-added observability layer.
