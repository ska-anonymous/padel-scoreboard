# Padel Scoreboard System

This project is a **monorepo** that contains all modules required to
build and run a fully functional **Padel Scoreboard System**.\
It combines a **React app**, **ESP32 firmware**, and a **Node.js
WebSocket server** (for development and testing).

------------------------------------------------------------------------

## 📂 Repository Structure

    /padel-scoreboard
    │── /react-app              # React frontend for scoreboard and admin controls
    │── /ScoreboardESP          # ESP32-S3 firmware for hosting app & WebSocket server
    │── /websocket-server       # Node.js WebSocket server (used in development/testing)

------------------------------------------------------------------------

## ⚡ Modules Overview

### 1. React App (`/react-app`)

-   Built with **React + Redux** and styled using **Bootstrap**.\
-   Provides the **scoreboard UI**, **admin controls**, and **QR
    access** for remote devices.\
-   Key features:
    -   Full **Padel scoring logic** (games, sets, tiebreakers, golden
        point, etc.).
    -   Multiple **game modes**: Regular, Points Game.\
    -   **Play styles**: Advantage, Golden Point.\
    -   **Set configurations**: 1, 3, best of 3, best of 5, infinite.\
    -   Optional **end-time mode** with timer.\
    -   Real-time **WebSocket sync** across all connected devices.\
    -   **QR page** for quick admin access.

### 2. ESP32 Firmware (`/esp32-firmware`)

-   Written for **ESP32-S3** (Arduino IDE).\
-   Responsibilities:
    -   Acts as an **Access Point** with captive portal and DNS
        redirection.\

    -   Serves the built **React app** (`dist/` files) directly from
        SPIFFS.\

    -   Hosts a **WebSocket server** to sync game state across connected
        clients.\

    -   Handles **physical push buttons** (2 per team:
        increment/decrement).\

    -   Broadcasts button actions as WebSocket events to all connected
        clients.\

    -   Event format:

        ``` json
        { "event": "score:increment", "data": { "team": "A" } }
        ```

### 3. Node.js WebSocket Server (`/node-ws-server`)

-   Used only for **development and testing** (not in production).\
-   Mimics ESP32 WebSocket server behavior.\
-   Features:
    -   Broadcasts events between clients.\
    -   Provides **sync request/response** handling so new clients get
        the current game state.

------------------------------------------------------------------------

## 🔄 Workflow

1.  ESP32 boots as an **Access Point** and serves the React app.\
2.  Clients connect to ESP32 WiFi and open the **scoreboard app**
    (auto-redirect via captive portal).\
3.  Game setup is done via `/admin` interface (teams, game config).\
4.  Physical buttons or WebSocket admin controls trigger events
    (`score:increment`, `game:reset`, etc.).\
5.  ESP32/WebSocket server **syncs game state** across all connected
    clients.

During **development**: - The React app connects to the **Node.js
WebSocket server** instead of ESP32 for rapid iteration.

------------------------------------------------------------------------

## 🚀 Getting Started

### React App

``` bash
cd react-app
npm install
npm run dev    # Development mode
npm run build  # Production build (to upload to ESP32)
```

### ESP32 Firmware

-   Open `/esp32-firmware/ScoreboardESP.ino` in Arduino IDE.\
-   Install required libraries (WebSockets, DNSServer, AsyncTCP, etc.).\
-   Upload to ESP32-S3 with SPIFFS support.\
-   Copy built React app (`react-app/dist/`) into `data/` folder before
    uploading.

### Node.js WebSocket Server (Dev only)

``` bash
cd node-ws-server
npm install
node server.js
```

------------------------------------------------------------------------

## 🛠️ Tech Stack

-   **Frontend**: React, Redux, Bootstrap, Vite\
-   **Backend/Socket**: Node.js (development), ESP32 (production)\
-   **Firmware**: Arduino IDE, ESP32-S3, SPIFFS\
-   **Communication**: WebSocket (JSON event format)

------------------------------------------------------------------------

## 📖 Event Format

All messages use the format:

``` json
{
  "event": "<event_name>",
  "data": { ... }
}
```

### Examples

-   Increment Team A:

    ``` json
    { "event": "score:increment", "data": { "team": "A" } }
    ```

-   Start game:

    ``` json
    { "event": "game:start", "data": { "config": { "sets": 3, "mode": "regular" } } }
    ```

-   Reset game:

    ``` json
    { "event": "game:reset" }
    ```

------------------------------------------------------------------------

## 📌 Notes

-   ESP32 is the **production WebSocket server**.\
-   Node.js server is **only for development/testing**.\
-   The system is designed for **multi-device sync**, allowing
    scoreboards, phones, and admin panels to all stay consistent in real
    time.

------------------------------------------------------------------------

## 📜 License

MIT License
