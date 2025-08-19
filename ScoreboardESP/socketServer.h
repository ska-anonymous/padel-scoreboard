#ifndef SOCKET_SERVER_H
#define SOCKET_SERVER_H

#include <ArduinoJson.h>

void setupWebSocket();
void sendMessageToClients(const String& jsonMsg);

#endif
