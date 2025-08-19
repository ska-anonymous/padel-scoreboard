#include <WiFi.h>
#include <DNSServer.h>
#include <ESPAsyncWebServer.h>
#include <SPIFFS.h>

const char* ssid = "Scoreboard_AP";
const char* password = "score123";

const byte DNS_PORT = 53;
DNSServer dnsServer;
AsyncWebServer server(80);

void setupWebServer() {
  if (!SPIFFS.begin(true)) {
    Serial.println("Failed to mount SPIFFS");
    return;
  }

  WiFi.softAP(ssid, password);
  IPAddress myIP = WiFi.softAPIP();
  Serial.println("AP IP address: " + myIP.toString());

  dnsServer.start(DNS_PORT, "*", myIP);

  server.serveStatic("/", SPIFFS, "/").setDefaultFile("index.html").setCacheControl("max-age=86400");

 server.onNotFound([](AsyncWebServerRequest *request) {
    request->send(SPIFFS, "/index.html", "text/html");
  });


  server.begin();
  Serial.println("Web server started");
}

void handleDNSLoop() {
  dnsServer.processNextRequest();
}
