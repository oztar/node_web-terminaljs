'use strict'
const ee = require('../').ee;
const j  = require('../').options;
const u  = require('../').u;

const { spawn } = require('child_process');

const name  = 'restart';
const errors = {
    UNDEFINED    : '%s internal error:'+"\r\n"+'%s'
};


const restartCon = {
    description : 'Restart nodejs program',
    usage : 'restart now',
    auto  : ['now']
}
const restart = function(socketID,args){
    try{
	if( args[1] == 'now'){
	    ee.emit(socketID,'Restarting');
	    process.on("exit", function () {
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
	    process.exit();
	}else{
	    ee.emit(socketID,restartCon.usage);
	}
    }catch(e){
	ee.emit(socketID+'err',u(errors['UNDEFINED'],'restart',e));
    }
}



const poweroffCon = {
    description : 'shutdown the program',
    usage : 'poweroff now',
    auto  : ['now']
}

const poweroff = function(socketID,args){ 
    try{
	if( args[1] == 'now'){
	    ee.emit(socketID,'Power Off');
	    process.exit();
	}else{
	    ee.emit(socketID,poweroffCon.usage);
	}
    }catch(e){
	ee.emit(socketID+'err',u(errors['UNDEFINED'],'poweroff',e));
    }
}

const load = function(socketID){}
const unload = function(socketID){}


module.exports = {
    command : {
	'restart' : restartCon,
	'poweroff': poweroffCon
    },
    restart,
    poweroff,
    load,
    unload,
    autload : false
}
