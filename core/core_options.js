'use strict'

const vars = ['proto','publicip','port','lngTimeout','verbose','modules','login','app','io','url'];


module.exports = function(options){
    if( options === undefined){ return;}
    
    for( let i in vars){
	const name = vars[i];	
	this.options[name] = options[name] || this.options[name];
    }
    
    if( this.options.app == ''){
	try{
	    let express = require('express');
	    this.options.app = express();
	}catch(e){
	    throw new Error('Web-terminal need minimum app = express(), use npm install express');
	}
    }
    if( this.options.io == ''){
	try{
	    const http = require('http');
	    const iosrv= require('socket.io');
	    const IOserver = http.createServer(this.options.app);
	    this.options.io = iosrv(IOserver);
	}catch(e){
	    throw new Error('Web-terminal need minimum lib http and socket.io, use command npm install http socket.io');
	}
    }	    
}
