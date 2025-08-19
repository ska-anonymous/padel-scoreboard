# ESP32-S3 Scoreboard System

This project is a **hybrid system** combining an ESP32-S3 microcontroller, a React frontend application, and a WebSocket server for testing and development.  
It allows updating and monitoring team scores using BLE HID devices (Bluetooth buttons).

---

## 📂 Project Structure

```
project-root/
│── esp32/                  # ESP32-S3 firmware code
│── react-app/              # React frontend application
│── websocket-server/       # WebSocket server (for local testing)
│── .gitignore
│── README.md
```

---

## ⚙️ Features

- **ESP32-S3 Firmware**
  - Connects to BLE HID devices (Bluetooth buttons).
  - Sends team score updates to the server.

- **React Frontend**
  - Displays real-time team scores.
  - Provides UI for manual score updates and monitoring.

- **WebSocket Server**
  - Simulates communication during development.
  - Provides a testing environment without requiring the actual ESP32 device.

---

## 🚀 Getting Started

### 1. Clone the Repository
```sh
git clone https://github.com/your-username/esp32-scoreboard.git
cd esp32-scoreboard
```

### 2. ESP32 Setup
- Open `esp32/` in PlatformIO or Arduino IDE.
- Flash the firmware to ESP32-S3.

### 3. React Frontend Setup
```sh
cd react-app
npm install
npm run dev
```

### 4. WebSocket Server Setup
```sh
cd websocket-server
npm install
node server.js
```

---

## 🛠️ Development Notes

- All `.env` files are ignored for security.
- `node_modules/` folders are excluded from Git across subdirectories.
- The WebSocket server is **only for development** and not required in production.

---

## 📌 License
This project is licensed under the MIT License.
