#include "webServer.h"
#include "socketServer.h"
// #include "bleManager.h"
#include "serialInputSimulator.h"
#include "buttonManager.h"
#include "constants.h"

void setup() {
  Serial.begin(115200);
  Serial.println("=== ESP32 Scoreboard Booting ===");
  Serial.println("=== Serial Command Simulator Ready ===");
  Serial.println("Commands: start, reset, pause, resume, a+, a-, b+, b-");
  setupWebServer();  // Serve React app + captive portal
  setupWebSocket();  // Start WebSocket server
  // setupBLE();        // Connect to Bluetooth buttons
  setupButtons();
}

void loop() {
  handleDNSLoop();    // Keep DNS server alive
  pollSerialInput();  // listen for serial input to process commands
  // updateBLE(); // keeps trying to reconnect BLE clients
  updateButtons();

}
