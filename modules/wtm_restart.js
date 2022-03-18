'use strict'
const u  = require('util').format;
const { spawn } = require('child_process');

const name  = 'restart';
const errors = {
    UNDEFINED    : '%s internal error:'+"\r\n"+'%s'
};


const restartCon = {
    description : 'Restart nodejs program',
    usage : 'Usage: restart now',
    auto  : ['now']
}
const restart = function(socketID,args){
    try{
	if( args[1] == 'now'){
	    this.emit(socketID,'Restarting\r\nyou need restart Terminal presh F5');
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
	    this.emit(socketID,restartCon.usage);
	}
    }catch(e){
	this.emit(socketID+'err',u(errors['UNDEFINED'],'restart',e));
    }
}



const poweroffCon = {
    description : 'shutdown the program',
    usage : 'Usage: poweroff now',
    auto  : ['now']
}

const poweroff = function(socketID,args){ 
    try{
	if( args[1] == 'now'){
	    this.emit(socketID,'Power Off');
	    process.exit(); 
	    throw new Error('comand exec poweroff and not process.exit correct');
	}else{
	    this.emit(socketID,poweroffCon.usage);
	}
    }catch(e){
	this.emit(socketID+'err',u(errors['UNDEFINED'],'poweroff',e));
    }
}


module.exports = {
    command : {
	'restart' : restartCon,
	'poweroff': poweroffCon
    },
    restart,
    poweroff,
    autload : false
}
