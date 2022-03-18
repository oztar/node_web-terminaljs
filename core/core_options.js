'use strict'

const vars = ['proto','publicip','port','lngTimeout','verbose','modules','login','app','express','io','url'];


module.exports = function(options){
    //const j = require('./').options;
    if( options === undefined){ return;}
    
    for( let i in vars){
	const name = vars[i];	
	this.options[name] = options[name] || this.options[name];
    }
    
    if( this.options.express == ''){
	try{
	    this.options.express = require('express');
	}catch(e){
	    throw new Error('Web-terminal need minimum lib express, use npm install express');
	}
    }
    if( this.options.app == ''){	
	this.options.app = this.options.express();
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
