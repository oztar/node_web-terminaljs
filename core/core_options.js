'use strict'

const vars = ['proto','publicip','port','lngTimeout','verbose','modules','login','app','io','url','repoURL','repoJson'];


module.exports = function(options){
    if( options === undefined){ return;}
    
    for( let i in vars){
	const name = vars[i];
	this.options[name] = options[name] || this.options[name];
    }
    
    if( options['webEngine'] !== undefined){
	this.options['webEngine'] = options['webEngine'];
    }
    
    if( this.options.app == '' && this.options.webEngine ){
	try{
	    let express = require('express');
	    this.options.app = express();

	    const http = require('http');
	    const iosrv= require('socket.io');
	    const IOserver = http.createServer(this.options.app);
	    this.options.io = iosrv(IOserver);

	}catch(e){
	    throw new Error('Web-terminal need minimum app = express(), use npm install express');
	}
    }
    if( this.options.io == ''){
	try{
	    this.options.io = require('socket.io')(this.options.port,{cors: { origin: "*",credentials: false}} );
	}catch(e){
	    throw new Error('Web-terminal need minimum lib http and socket.io, use command npm install http socket.io');
	}
    }	    
}
