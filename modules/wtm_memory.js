 'use strict'
const u = require('util').format;

const errors = {
    UNDEFINED    : '%s internal error:'+"\r\n"+'%s'
};

const memoryCom = {
    description : 'Memory - List memory usage nodejs',
    usage : 'memory \n\rmem',
    auto  : null
}

const _memory = function(socketID){
    try{
	let response = 'Memory Usage:'+"\n\r";
	const used = process.memoryUsage();
	for (let key in used) {
	    let mem = Math.round(used[key] / 1024 / 1024 * 100) / 100;
	    response += key+' '+mem+'MB'+"\n";
	}
	this.emit(socketID,response);
    }catch(e){
	this.emit(socketID+'err',u(errors['UNDEFINED'],'memory',e));
    }
}


const load = function(socketID){}

const unload = function(socketID){}



module.exports = {
    command : {
	'mem' : memoryCom,
	'memory' : memoryCom,
    },
    memory : _memory,
    mem    : _memory,
    load,
    unload,
    autoload : false
}
