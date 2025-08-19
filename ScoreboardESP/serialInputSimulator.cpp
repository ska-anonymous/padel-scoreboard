#include "serialInputSimulator.h"
#include "socketServer.h"
#include "constants.h"

void handleSerialCommand(String cmd) {
  cmd.trim();
  cmd.toLowerCase();

  String message;

  if (cmd == "start") {
    message = "{\"event\":\"" + String(SOCKET_EVENTS::GAME_START) + "\",\"data\":null}";
  } else if (cmd == "reset") {
    message = "{\"event\":\"" + String(SOCKET_EVENTS::GAME_RESET) + "\",\"data\":null}";
  } else if (cmd == "a+") {
    message = "{\"event\":\"" + String(SOCKET_EVENTS::SCORE_INCREMENT) + "\",\"data\":\"teamA\"}";
  } else if (cmd == "a-") {
    message = "{\"event\":\"" + String(SOCKET_EVENTS::SCORE_DECREMENT) + "\",\"data\":\"teamA\"}";
  } else if (cmd == "b+") {
    message = "{\"event\":\"" + String(SOCKET_EVENTS::SCORE_INCREMENT) + "\",\"data\":\"teamB\"}";
  } else if (cmd == "b-") {
    message = "{\"event\":\"" + String(SOCKET_EVENTS::SCORE_DECREMENT) + "\",\"data\":\"teamB\"}";
  } else if (cmd == "sync") {
    message = "{\"event\":\"" + String(SOCKET_EVENTS::SYNC_REQUEST) + "\",\"data\":null}";
  } else {
    Serial.println("❌ Unknown command. Try: start, reset, a+, a-, b+, b-, sync");
    return;
  }

  Serial.println("📤 Sending: " + message);
  sendMessageToClients(message);
}

void pollSerialInput() {
  if (Serial.available()) {
    String cmd = Serial.readStringUntil('\n');
    handleSerialCommand(cmd);
  }
}
