#include "socketServer.h"
#include "constants.h"
#include <ESPAsyncWebServer.h>
#include <ArduinoJson.h>

extern AsyncWebServer server;

AsyncWebSocket ws("/ws");

// === Helper: Send to all except sender ===
void broadcastToOthers(uint32_t senderId, const String& msg) {
  for (auto& client : ws.getClients()) {
    if (client.id() != senderId && client.canSend()) {
      client.text(msg);
    }
  }
}


// === Helper: Send to first client except sender ===
void sendToFirstAvailableClient(uint32_t senderId, const String& msg) {
  for (auto& client : ws.getClients()) {
    if (client.id() != senderId && client.canSend()) {
      client.text(msg);
      Serial.println("[ESP] 🔁 Forwarded sync:request to first available client");
      return;
    }
  }
  Serial.println("[ESP] ⚠️ No other client available to handle sync request");
}

void setupWebSocket() {
  ws.onEvent([](AsyncWebSocket *server, AsyncWebSocketClient *client,
                AwsEventType type, void *arg, uint8_t *data, size_t len) {
    if (type == WS_EVT_CONNECT) {
      Serial.printf("[ESP] ✅ WebSocket client %u connected\n", client->id());
    } else if (type == WS_EVT_DISCONNECT) {
      Serial.printf("[ESP] ❌ WebSocket client %u disconnected\n", client->id());
    } else if (type == WS_EVT_DATA) {
      AwsFrameInfo *info = (AwsFrameInfo*)arg;

      if (info->opcode == WS_TEXT) {
        String msg = "";
        for (size_t i = 0; i < len; i++) {
          msg += (char)data[i];
        }

        Serial.printf("[ESP] 📩 Received from %u: %s\n", client->id(), msg.c_str());

        StaticJsonDocument<256> doc;
        DeserializationError err = deserializeJson(doc, msg);
        if (err) {
          Serial.println("[ESP] ❌ Invalid JSON received");
          return;
        }

        const char* event = doc["event"];
        if (!event) {
          Serial.println("[ESP] ❌ Missing 'event' field");
          return;
        }

        if (strcmp(event, SOCKET_EVENTS::SYNC_REQUEST) == 0) {
          sendToFirstAvailableClient(client->id(), msg);
        } else {
          broadcastToOthers(client->id(), msg);
        }
      }
    }
  });

  server.addHandler(&ws);
}

void sendMessageToClients(const String& jsonMsg) {
  ws.textAll(jsonMsg);
}
