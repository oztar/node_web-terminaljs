'use strict'
const ee = require('../').ee;
const j  = require('../').options;
const { spawn } = require('child_process');

const name  = 'restart';
const errors = {
    UNDEFINED    : '%s internal error:'+"\r\n"+'%s'
};

const _funct = function(socketID){
    try{
	process.on("exit", function () {
	    //  Resolve the `child_process` module, and `spawn` 
	    //  a new process.
	    //  The `child_process` module lets us
	    //  access OS functionalities by running any bash command.`.
	    spawn(
		process.argv.shift(),
		process.argv,
		{
		    cwd: process.cwd(),
		    detached: true,
		    stdio: "inherit"
		}
	    );    
	});
	ee.emit(socketID,'Restarting');
	process.exit();
    }catch(e){
	ee.emit(socketID+'err',u(errors['UNDEFINED'],name,e));
    }
}

const load = (socketID)=>{
    ee.on(name,_funct);
    j.list_command[name]= name;
    j.list_usage_command[name]  = 'restart - nodejs';
    j.list_auto_command[name] = null;//not arguments
    ee.emit('send_autocomplete',name,j.list_auto_command[name]);
}

const unload = (socketID)=>{
    ee.off(name,_funct);
    delete j.list_command[name];
    delete j.list_usage_command[name];
    ee.emit('del_autocomplete',name);
}

module.exports = {
load,
unload
}
