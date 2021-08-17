import React from 'react';
import * as  io  from "socket.io-client";
// import * as config from './config.json';
const ws = io( window.location.origin ) ;
ws.on('connect',()=>{ ws.emit('source','client')  })
export default ws