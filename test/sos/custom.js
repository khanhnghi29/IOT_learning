var socket = io("http://localhost:4000");

let Charts;

const renderData = (data) => {
  console.log(data);
  var nhietdo = data.temp;
  var doam = data.hum;
  var anhsang = data.light;
  var created_at = data.created_at;

  if(nhietdo <=30){
      document.getElementById("temperature").style.backgroundImage = `linear-gradient(to right, Crimson, white `;
    }else if(nhietdo <= 70){
      document.getElementById('temperature').style.backgroundImage = `linear-gradient(to right,  Crimson, Beige)`;
    }else{
    document.getElementById("temperature").style.backgroundImage = `linear-gradient(to right,  Crimson, orange )`;
   }
   var temperature1 = document.getElementById("temperature1"); //tra ve co thuoc tinh id
   temperature1.innerHTML=`${nhietdo}`; //khi nao nhan gia tri thì thay dổi nội dụng

  if(doam <=30){
      document.getElementById("humidity").style.backgroundImage = `linear-gradient(to right, Black , DeepSkyBlue`;
    }else if(doam <= 70){
      document.getElementById('humidity').style.backgroundImage = `linear-gradient(to right, Black, white`;
  }else{
    document.getElementById("humidity").style.backgroundImage = `linear-gradient(to right,  Black, Grey`;
}
  var humidity1 = document.getElementById("humidity1");
  humidity1.innerHTML=`${doam}`;

  if(anhsang <=100){
      document.getElementById("thelight").style.backgroundImage = `linear-gradient(to right, Yellow, Khaki`;
    }else if(anhsang <= 700){
     document.getElementById('thelight').style.backgroundImage = `linear-gradient(to right,  Yellow, Black`;
  }else{

    document.getElementById("thelight").style.backgroundImage = `linear-gradient(to right,  Yellow, White`;
}
  var thelight1 = document.getElementById("thelight1");
  thelight1.innerHTML=`${anhsang}`;


  if(Charts.data.labels.length >= 6){
    Charts.data.datasets.forEach((el,index) => {
      el.data.shift();
      if(index == 0){
        el.data.push(nhietdo);
      }
      else if(index == 1){
        el.data.push(doam)
      }
      else{
        if(index==2){
        el.data.push(anhsang)
        }
      }
    });
    Charts.data.labels.shift();
  }

  Charts.data.labels.push(created_at);
  Charts.data.datasets.forEach((el,index) => {
    if(index == 0){
      el.data.push(nhietdo);
    }
    else if(index == 1){
      el.data.push(doam)
    }
    else{ if(index==2){
      el.data.push(anhsang)
    }
  }
  }
  );
  Charts.update();
}


socket.on("sensorss", function (data) {
  if (data) {
    renderData(data);
  }
   
});




function right(){  
  const note = confirm('Bạn muốn BẬT ĐÈN KHÔNG?')
  if(note){
    socket.emit("Led1", "on");
    document.getElementById("myImage").src= "bongdensang.jpg";
    document.getElementById('led1').style.backgroundImage = `linear-gradient(to right,green,white)`;
  }
}

function left(){
  const note = confirm('Bạn muốn Tắt ĐÈN KHÔNG?')
  if(note){
    socket.emit("Led1", "off");
    document.getElementById("myImage").src= "bongden.jpg";
    document.getElementById("led1").style.backgroundImage = `linear-gradient(to left, white, gray`;
 }
}

function right1(){  
  const note = confirm('Bạn muốn BẬT ĐÈN KHÔNG?')
  if(note){
    socket.emit("Led2", "on");
    document.getElementById("myImage1").src= "bongdensang.jpg";
    document.getElementById('led2').style.backgroundImage = `linear-gradient(to right,  green,white`;
  }
}

function left1(){
  const note = confirm('Bạn muốn Tắt ĐÈN KHÔNG?')
  if(note){
    socket.emit("Led2", "off");
    document.getElementById("myImage1").src= "bongden.jpg";
    document.getElementById("led2").style.backgroundImage = `linear-gradient(to left, white,gray`;
 }
}


const data_chart = {
  labels: [],
  datasets: [
    {
      label: 'Temperature',
      data: [],
      borderColor: "red",
      backgroundColor: "red",
      yAxisID: 'y',
    },
    {
      label: 'humidity',
      data: [],
      borderColor: "blue",
      backgroundColor: "blue",
      yAxisID: 'y',
    }, {
      label: 'light',
      data: [],
      borderColor: "yellow",
      backgroundColor: "yellow",
      yAxisID: 'y1',
    }
  ]}  

const config = {
  type: 'line',
  data: data_chart,
  options: {
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: 'Chart.js Line Chart - Cubic interpolation mode'
      },
    },
    interaction: {
      intersect: false,
    },
    scales: {
      y: {
        display: true,
        max:100,
        title: {
          display: true,
          text: 'temperature or humidity'
        },
        position:"left",
      },
      y1: {
        display: true,
        max:1024,
        title: {
          display: true,
          text: 'light'
        },
        position:"right",
      },
    }
  },
};
 Charts = new Chart("chart",config);

