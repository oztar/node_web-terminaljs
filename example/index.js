'use strict'
const express = require('./srv_web').express;
const http    = require('./srv_web').http;
const libIO   = require('./srv_web').io;

const wt = require('web-terminaljs').terminaljs;


const options = { 
    port : 80
};




const app     = express();
app.listen();

const IOserver  = http.createServer(app);
/*
  const origin  = j.mem.web.proto+'://'+j.config.serverInfo.publicIp+':'+j.config.web.port
  let io        = libIO(IOserver,{
   cors: {
	origin,
	methods: ["GET", "POST"],
	credentials: false
    }
    });
*/
const io = libIO(IOserver);


//iniciamos web terminal
wt(options,express,app,io);



IOserver.listen(options.port);
