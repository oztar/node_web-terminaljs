'use strict'
const ee = require('web-terminaljs').ee;
const f  = require('web-terminaljs').functions;
const crypto     = require('crypto');
const user_list  = require('../user_list');
/*

  the modules not need commands
  you use other events, and other code. 
    
  autoload is true you using Load and Unload for module. 
*/
const load = function(socketID){
    this.login = function(data){
	try{
	    //user autheticated
	    const hash = crypto.createHash('sha256').update(data.nonce+user_list[data.user]).digest('base64');
	    if( hash == data.pass){
		this.emit(data.id+'login|true');
	    }else{
		//user not authenticated
		this.emit(data.id+'login|false');
	    }
	}catch(e){
	    this.emit(data.id+'login|false');
	}
    }    
}
const unload = function(socketID){
    this.login = this._login;
}

module.exports = {
    command : {},
    load,
    unload,
    autoload : true
}
