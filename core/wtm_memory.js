'use strict'
let ee = require('../').ee;
let j  = require('../').options;

const name  = 'memory';
const errors = {
    UNDEFINED    : '%s internal error:'+"\r\n"+'%s'
};

const _memory = function(socketID){
    try{
	let response = 'Memory Usage:'+"\n\r";
	const used = process.memoryUsage();
	for (let key in used) {
	    let mem = Math.round(used[key] / 1024 / 1024 * 100) / 100;
	    response += key+' '+mem+'MB'+"\n";
	}
	ee.emit(socketID,response);
    }catch(e){
	ee.emit(socketID+'err',u(errors['UNDEFINED'],name,e));
    }
}


const load = (socketID)=>{
    ee.on(name,_memory);
    ee.on('mem',_memory);//alias memory
    j.list_command[name]= 'Memory';
    j.list_command['mem']= 'Memory';
    j.list_usage_command[name]  = 'memory - List memory usage nodejs';
    j.list_usage_command['mem'] = 'mem alias memory '+"\r\n";
    j.list_usage_command['mem'] += j.list_usage_command[name]

    j.list_auto_command[name] = null;//not arguments
    ee.emit('send_autocomplete',name,j.list_auto_command[name]);
}

const unload = (socketID)=>{
    ee.off(name,_memory);
    ee.off('mem',_memory);
    delete j.list_command[name];
    delete j.list_command['mem'];
    delete j.list_usage_command[name];
    delete j.list_usage_command['mem'];
    ee.emit('del_autocomplete',name);
}
module.exports = {
load,
unload
}
