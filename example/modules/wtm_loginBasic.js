'use strict'
const ee = require('web-terminaljs').ee;
const f  = require('web-terminaljs').functions;

/*
  the modules not need commands
  you use other events, and other code. 
    
  autoload is true you using Load and Unload for module. 
*/
const load = function(socketID){
    this.login = function(data){
	console.log(data);
	/*
	  your code here
	 */
	//user autheticated
	this.emit(data.id+'login|true');

	//user not authenticated
	//this.emit(data.id+'login|false');
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
