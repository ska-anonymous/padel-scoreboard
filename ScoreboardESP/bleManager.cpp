#include "bleManager.h"
#include "socketServer.h"
#include <BLEDevice.h>
#include <BLEUtils.h>
#include <BLEScan.h>
#include <BLEAdvertisedDevice.h>

#define REMOTE_ADDRESS1 "81:D5:E2:CB:F8:07"  // Team A
#define REMOTE_ADDRESS2 "9B:2B:67:EC:CC:DC"  // Team B

#define SERVICE_UUID "00001812-0000-1000-8000-00805f9b34fb"
#define CHARACTERISTIC_UUID "00002a4d-0000-1000-8000-00805f9b34fb"

BLEClient* pClient1 = nullptr;
BLEClient* pClient2 = nullptr;
BLERemoteCharacteristic* pRemoteChar1 = nullptr;
BLERemoteCharacteristic* pRemoteChar2 = nullptr;

bool deviceConnected1 = false;
bool deviceConnected2 = false;

unsigned long lastReconnectAttempt1 = 0;
unsigned long lastReconnectAttempt2 = 0;
const unsigned long RECONNECT_INTERVAL_MS = 8000;

// === Process HID Button Press ===
void processInput(uint8_t* data, size_t length, const char* team) {
  if (length < 3) return;

  uint8_t keycode = data[2];
  String action;

  if (keycode == 0x1E) action = "increment";
  else if (keycode == 0x1F) action = "decrement";

  if (action.length()) {
    String json = "{\"action\":\"" + action + "\",\"team\":\"" + String(team) + "\"}";
    sendMessageToClients(json);
    Serial.println("Sent: " + json);
  }
}

// === BLE Callbacks ===
class MyClientCallback : public BLEClientCallbacks {
  void onConnect(BLEClient* c) {
    if (c == pClient1) {
      deviceConnected1 = true;
      Serial.println("[Team A] Connected");
    } else if (c == pClient2) {
      deviceConnected2 = true;
      Serial.println("[Team B] Connected");
    }
  }

  void onDisconnect(BLEClient* c) {
    if (c == pClient1) {
      deviceConnected1 = false;
      Serial.println("[Team A] Disconnected");
    } else if (c == pClient2) {
      deviceConnected2 = false;
      Serial.println("[Team B] Disconnected");
    }
  }
};

// === Notify Callbacks ===
static void notifyCallback1(BLERemoteCharacteristic* chr, uint8_t* data, size_t length, bool) {
  processInput(data, length, "A");
}

static void notifyCallback2(BLERemoteCharacteristic* chr, uint8_t* data, size_t length, bool) {
  processInput(data, length, "B");
}

bool connectDevice(const char* mac, int which) {
  BLEAddress addr(mac);
  BLEClient*& client = (which == 1) ? pClient1 : pClient2;
  BLERemoteCharacteristic*& chr = (which == 1) ? pRemoteChar1 : pRemoteChar2;
  auto notifyCB = (which == 1) ? notifyCallback1 : notifyCallback2;
  String label = (which == 1) ? "[Team A]" : "[Team B]";

  if (!client) {
    client = BLEDevice::createClient();
    client->setClientCallbacks(new MyClientCallback());
  }

  Serial.printf("%s Connecting to %s...\n", label.c_str(), mac);
  if (!client->connect(addr)) {
    Serial.printf("%s Connection failed\n", label.c_str());
    return false;
  }

  auto service = client->getService(SERVICE_UUID);
  if (!service) {
    Serial.printf("%s HID service not found\n", label.c_str());
    return false;
  }

  chr = service->getCharacteristic(CHARACTERISTIC_UUID);
  if (!chr || !chr->canNotify()) {
    Serial.printf("%s HID report char not notifiable\n", label.c_str());
    return false;
  }

  chr->registerForNotify(notifyCB);
  Serial.printf("%s Connected and subscribed\n", label.c_str());
  return true;
}

void setupBLE() {
  BLEDevice::init("");
  connectDevice(REMOTE_ADDRESS1, 1);
  connectDevice(REMOTE_ADDRESS2, 2);
}

void updateBLE() {
  unsigned long now = millis();

  if (!deviceConnected1 && now - lastReconnectAttempt1 >= RECONNECT_INTERVAL_MS) {
    lastReconnectAttempt1 = now;
    Serial.println("[Team A] Attempting reconnect...");
    connectDevice(REMOTE_ADDRESS1, 1);
  }

  if (!deviceConnected2 && now - lastReconnectAttempt2 >= RECONNECT_INTERVAL_MS) {
    lastReconnectAttempt2 = now;
    Serial.println("[Team B] Attempting reconnect...");
    connectDevice(REMOTE_ADDRESS2, 2);
  }
}
