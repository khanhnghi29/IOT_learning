const express = require("express");
const http = require("http");
const socketio = require("socket.io");
const app = express();
const server = http.createServer(app);
const io = socketio(server);

const {
  createTable,
  insertNewData,
 
} = require("./module");

const port = 4000;

app.use(express.static("sos")); 

app.get("/dashboard", (req, res) => { //hiển thị phuong thuc 
    res.sendFile("./sos/index.html", { root: __dirname }); //đọc nội dung của nó gui lên trình duyet 
  });

server.listen(port, () =>
  console.log(`Server listening on port: ${port}`)
);

// Create Table
createTable();

const mqtt = require("mqtt");

// Connect to mqtt
const options = {
  clientID: "",
  username: "",
  password: "",
  host: "192.168.50.71",
  port: 1883,
};

const mqttClient = mqtt.connect(options);

// setup the callbacks

mqttClient.on('connect', () => {
	console.log('✅ Connected to MQTT Broker');
	mqttClient.subscribe('sensors', () => {
		mqttClient.on('message', (topic, payload) => {  //nhận choiix
			let tmp = payload.toString().split(',');  //phân tach chuoi thành một mảng duex liệu dua tren ki tu trong chuoi
			data = {
				temp: tmp[0],
				hum: tmp[1],
				light: tmp[2],
				created_at: new Date().toLocaleString(),
        
			};
      
      console.log(data);
      io.sockets.emit('sensorss', data);
      const newDataTemp = Math.round(data.temp);
  const newDataHumidity = Math.round(data.hum);
  const newDataLight = Math.round(data.light);  
  const ss_id = Math.floor(Math.random()*4)+1 ;//xem lai
  insertNewData(ss_id, newDataTemp, newDataHumidity, newDataLight);

		});
	});
  
  
});

io.on("connection", function (socket) {
  socket.on("Led1", function (data) {
    if (data == "on") {
      console.log("Led1 ON");
      mqttClient.publish("d1", "0");
    } else {
      console.log("Led1 OFF");
      mqttClient.publish("d1", "1");
    }
  });

  socket.on("Led2", function (data) {
    if (data == "on") {
      console.log("Led2 ON");
      mqttClient.publish("d2", "0");
    } else {
      console.log("Led2 OFF");
      mqttClient.publish("d2", "1");
    }
  });
});