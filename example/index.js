'use strict'
const express = require('./srv_web').express;
const http    = require('./srv_web').http;
const libIO   = require('./srv_web').io;

//const wt = require('web-terminaljs').terminaljs;
const libwt = require('web-terminaljs');

class webTerminal extends libwt{
    login(dats){
	console.log('extended login',dats);
    }
    
}





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

const options = { 
    port : 80,
    modules : {
	"wtm_default" : true,
	"wtm_loginBasic" : false,
	"wtm_loginCrypto" : true
    },
    login : false,
    users : require('./user_list'),
    express,
    app,
    io
};


//iniciamos web terminal
//wt(options,express,app,io);
const wt = new libwt(options);

wt.on('save:config', function(module_list){
    console.log('o yea! ',module_list);
});




//console.log(app);

IOserver.listen(options.port);
