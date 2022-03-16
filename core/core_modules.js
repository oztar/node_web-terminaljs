'use strict'


let ee = require('../').ee;
let j  = require('../').options;

const coreModules = {
    wtm_memory : true,
    wtm_restart: true,
    wtm_utils  : true,
    wtm_verbose: true,
    wtm_echo   : true
}
const corePath = __dirname+'/';//modules Core


const load_module = function(socketID,name,path = j.path){
    if( socketID !== null){
	ee.emit(socketID,'Loading '+name);
    }

    //load module
    j.module[name]  = require(path+name);
    j.modules[name] = true;

    //set commands
    for( let moduleName in j.module[name].command){	
	const command = j.module[name].command[moduleName];
	ee.on( moduleName , j.module[name][moduleName]);
	j.list_command[moduleName]       = command.description;
	j.list_usage_command[moduleName] = command.usage;
	j.list_auto_command[moduleName]  = command.auto;
	ee.emit('send_autocomplete',moduleName,j.list_auto_command[moduleName]);
    }


    //auto start
    if( j.module[name].autoload){
	j.module[name].load(socketID);
    }

    if( socketID !== null){
	ee.emit(socketID,'Load '+name);
    }
}
const unload_module = function(socketID,name,path = j.path){
    if( socketID !== null){
	ee.emit(socketID,'unloading '+name);
    }

    //auto unload
    if( j.module[name].autoload){
	j.module[name].unload(socketID);
    }

    //unset commands
    for( let moduleName in j.module[name].command){

	ee.off( moduleName , j.module[name][moduleName]);
	delete j.list_command[moduleName];
	delete j.list_usage_command[moduleName];
	delete j.list_auto_command[moduleName];
	ee.emit('del_autocomplete',moduleName);
    }

    //unload module
    delete require.cache[require.resolve(path+name)];
    delete j.module[name];
    j.modules[name] = false;

    if( socketID !== null){
	ee.emit(socketID,'unload '+name);
    }
}




for( let name in coreModules){
    load_module(null,name,corePath);
}



ee.on('command:load_module',load_module);
ee.on('command:unload_module',unload_module);
ee.once('start|load_modules', function(){
    for( let name in j.modules){
	console.log(name);
	if( j.modules[name]){
	    load_module(null,name,j.path);
	    console.log(name,'loaded');
	}
    }
});
