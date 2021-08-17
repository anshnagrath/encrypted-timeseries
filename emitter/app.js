const express = require('express')
const dotenv = require('dotenv').config();
const app = express();
const path = require('path');
const server = require('http').Server(app);
const io = require('socket.io')(server,{ cors: { origin: "*", methods: "*"  , transports: ['websocket'] }});
const {emitEvents} = require('./src/emitter');
const {SendErrorsToFlock} = require('./src/utility')
const allClientSockets = { };
let emitterIntervals= [];

app.use(express.static(path.join(__dirname, 'public')));

io.on('connect_error', async (err) => {
   console.log("Socket Error" , err); 
    await SendErrorsToFlock(err);
  }
);
io.on('connect_failed', async (err) => {
  
  console.log("Error Occured",err) 
  await SendErrorsToFlock(err);

});

io.on('connection', (client) => {

  console.log("connected",client.id);  

  client.on("source", (payload) => {
      if (payload == "client") allClientSockets['client'] = client;
      else if (payload == "listner-server")  allClientSockets['listner-server'] = client;
      
    });

 client.on('server_start', (data) => { 
      console.log('starting server now' )
      let interval = setInterval( async ()=>{   allClientSockets['listner-server'].emit('start_listener', await emitEvents()  ); } , 10000) ; 
      emitterIntervals.push(interval);
   });

    
  client.on('server_stop', (data) => { 
       console.log('stoping server mow') 
       emitterIntervals.forEach((interval) => clearInterval(interval))
   });

  client.on('refresh_client',(data)=>{
    console.log('resfresh client ===>')
    allClientSockets['client'].emit('refresh',data) });
  client.on("disconnect", () => { delete   allClientSockets[client.id] });

});




server.on("error", async(err)=> {  
     console.log("Emitter Error :===>", err)
     await SendErrorsToFlock(err);

});

server.listen(3000); 