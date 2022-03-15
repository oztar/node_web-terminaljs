'use strict'


let ee = require('../').ee;
let j  = require('../').options;

const coreModules = {
  	wtm_memory : true,
	wtm_restart: true,
	wtm_utils  : true,
	wtm_verbose: true
}
const corePath = __dirname+'/';//modules Core


const load_module = function(socketID,name,path = j.path){
    if( socketID !== null){
	ee.emit(socketID,'Loading '+name);
    }

    j.module[name]  = require(path+name);
    j.modules[name] = true;
    j.module[name].load(socketID);
    if( socketID !== null){
	ee.emit(socketID,'Load '+name);
    }
}
const unload_module = function(socketID,name,path = j.path){
    if( socketID !== null){
	ee.emit(socketID,'unloading '+name);
    }
    j.module[name].unload(socketID);
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
