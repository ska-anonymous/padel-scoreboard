#include "buttonManager.h"
#include "socketServer.h"
#include "constants.h"
#include <Arduino.h>

#define BTN_A_INC 13
#define BTN_A_DEC 12
#define BTN_B_INC 14
#define BTN_B_DEC 17

bool lastAInc = HIGH;
bool lastADec = HIGH;
bool lastBInc = HIGH;
bool lastBDec = HIGH;

unsigned long lastDebounceTime[4] = { 0, 0, 0, 0 };
const unsigned long debounceDelay = 30;

void setupButtons() {
  pinMode(BTN_A_INC, INPUT_PULLUP);
  pinMode(BTN_A_DEC, INPUT_PULLUP);
  pinMode(BTN_B_INC, INPUT_PULLUP);
  pinMode(BTN_B_DEC, INPUT_PULLUP);
}

void sendButtonEvent(const char* event, const char* team) {
  String json = "{\"event\":\"" + String(event) + "\",\"data\":\"" + String(team) + "\"}";
  sendMessageToClients(json);
  Serial.printf("🔘 Button pressed → %s\n", json.c_str());
}

void checkButton(int pin, bool& lastState, const char* event, const char* team, int index) {
  bool reading = digitalRead(pin);

  if (reading != lastState && (millis() - lastDebounceTime[index] > debounceDelay)) {
    lastDebounceTime[index] = millis();
    if (reading == LOW) {
      sendButtonEvent(event, team);
    }
  }

  lastState = reading;
}

void updateButtons() {
  checkButton(BTN_A_INC, lastAInc, SOCKET_EVENTS::SCORE_INCREMENT, "teamA", 0);
  checkButton(BTN_A_DEC, lastADec, SOCKET_EVENTS::SCORE_DECREMENT, "teamA", 1);
  checkButton(BTN_B_INC, lastBInc, SOCKET_EVENTS::SCORE_INCREMENT, "teamB", 2);
  checkButton(BTN_B_DEC, lastBDec, SOCKET_EVENTS::SCORE_DECREMENT, "teamB", 3);
}
