
const io   =require('socket.io-client');
const  listenToEmitedData    =  require('./src/listener');
const dotenv = require('dotenv').config()
const fetchAllData =  require('./src/fetchall');
const { SendErrorsToFlock} = require('./src/utility/index');

const socket = io.connect(process.env.HOST);


socket.on('error', async (err) => { 
   console.log("Socket Error" , err);
   await SendErrorsToFlock(err); 
});
socket.on('connect_error', async (err) =>{ 
   console.log("Socket Error" , err) 
   await SendErrorsToFlock(err); 
});
socket.on('connect_failed', async (err) => {
    console.log("Error Occured",err)
    await SendErrorsToFlock(err); 
   });

socket.on('connect', () => { 
   console.log("Socket Connected To Emitter ===>") 
   socket.emit('source','listner-server')  
  

});




socket.on('start_listener', async ( data ) => { 
   console.log('started listener ---')
   let process =   await  listenToEmitedData(data) 
   console.log(process,"acascsdcsdcs")

   let fetchedData = await fetchAllData() 
   console.log(fetchedData.result,"asdcasdcsadcsdcs")
   if(fetchedData.result) socket.emit('refresh_client' ,{ payload : fetchedData.result } )
   
  
});
socket.on('disconnect', () => console.log('Socket disconnected from listener') );



