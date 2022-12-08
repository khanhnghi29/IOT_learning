#include <ESP8266WiFi.h>
#include <PubSubClient.h>
#include <DHT.h>
#include <Wire.h>

// Define sensors
#define DHTPIN D1
#define DHTTYPE DHT11
DHT dht(DHTPIN, DHTTYPE);


// Define devices
#define D1PIN D0
#define D2PIN D2
#define D3PIN A0

// Wifi configuration
const char *ssid = "Tad";
const char *pass = "12345687";

// MQTT Broker configuration
// const char *mqttServer = "broker.emqx.io";
const char *mqttServer = "192.168.50.71";
const int mqttPort = 1883;
const char *mqttUser = ""; 
const char *mqttPass = "";
const char *mqttClientId = "";

long lastMsg = 0;

// Init client
// WiFiClient alow;
// PubSubClient client(alow);
WiFiClient espClient;                         // init espClient
PubSubClient client(espClient);

// Connect Wifi
void initWifi()
{
  WiFi.mode(WIFI_STA);

  Serial.println();
  Serial.print("Connecting Wifi..");
  WiFi.begin(ssid, pass);
  while (WiFi.status() != WL_CONNECTED)
  {
    Serial.print(".");
    delay(500);
  }
  Serial.println();
  Serial.print("Connected to Wifi! IP address: ");
  Serial.println(WiFi.localIP());
}

// Connect MQTT Broker
void mqttConn()
{
  while (!client.connected())
  {
    Serial.println();
    Serial.print("Connecting to MQTT Broker..");
    if (client.connect(mqttClientId, mqttUser, mqttPass))
    {
      Serial.println("Connected to MQTT Broker");
      client.subscribe("d1");
      client.subscribe("d2");
    }
    else
    {
      Serial.println("Failed to connect! Retry in 3 second...");
      Serial.println(client.state());
      delay(3000);
    }
  }
}

// MQTT Callback
void callback(char *topic, byte *payload, unsigned int length)
{
  if (strcmp(topic, "d1") == 0)
  {
    if ((char)payload[0] == '0')
    {
      Serial.println("D1 ON");
      digitalWrite(D1PIN, HIGH);
    }
    else
    {
      Serial.println("D1 OFF");
      digitalWrite(D1PIN, LOW);
    }
  }
  if (strcmp(topic, "d2") == 0)
  {
    if ((char)payload[0] == '0')
    {
      Serial.println("D2 ON");
      digitalWrite(D2PIN, HIGH);
    }
    else
    {
      Serial.println("D2 OFF");
      digitalWrite(D2PIN, LOW);
    }
  }
}

void setup()
{
  Serial.begin(9600);
  Wire.begin();
  initWifi();
  pinMode(D1PIN, OUTPUT);
  digitalWrite(D1PIN, HIGH);
  pinMode(D2PIN, OUTPUT);
  digitalWrite(D2PIN, HIGH);
  client.setServer(mqttServer, mqttPort);
  client.setCallback(callback);
  dht.begin();
}

void loop()
{
  if (!client.connected())
    mqttConn();
  client.loop();

  unsigned long now = millis();
  if (now - lastMsg > 3000)
  {
    // Read sensors data
    int t = dht.readTemperature();
    int h = dht.readHumidity();
    int l = analogRead(D3PIN);
    // Combine data to t,h,l
  
    String ssData = String(t) + "," + String(h) + ","+ String(l); //gep 3 cai tao tành chuôi
    client.publish("sensors", ssData.c_str());
    Serial.print("Pushed data: ");
    Serial.println(ssData);
    lastMsg = now;
  }
}