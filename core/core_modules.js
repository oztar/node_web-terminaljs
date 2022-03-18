'use strict'


const coreModules = {
    wtm_memory : true,
    wtm_restart: true,
    wtm_utils  : true,
    wtm_verbose: true,
    wtm_login  : true,
    wtm_echo   : true
}
const corePath = __dirname+'/../modules/';//modules Core

module.exports ={
    load_module : function(socketID,name,path = this.options.path){
	if( socketID !== null){
	    this.emit(socketID,'Loading '+name);
	}	


		     
	//load module	
	this.module[name]  = require(path+name); 
	this.list_modules[name] = true;

	//set all functions
	for( let expName in this.module[name]){
	    if( expName == 'command'){continue;}

	    this[name+'_'+expName] = this.module[name][expName];
	}

	//set commands
	for( let moduleName in this.module[name].command){	
	    const command = this.module[name].command[moduleName];
	    this['module_'+moduleName]  = this[name+'_'+moduleName];//function command 

	    this.options.list_command[moduleName]       = command.description;
	    this.options.list_usage_command[moduleName] = command.usage;
	    this.options.list_auto_command[moduleName]  = command.auto;

	    this.emit('send_autocomplete',moduleName,this.options.list_auto_command[moduleName]);
	}
		
	//auto start
	if( this.module[name].autoload){
	    this[name+'_load'](socketID);
	   // this.options.module[name]['load'](socketID);
	}
	
	if( socketID !== null){
	    this.emit(socketID,'Load '+name);
	}

    },
    unload_module : function(socketID,name,path = this.options.path){
	if( socketID !== null){
	    this.emit(socketID,'unloading '+name);
	}
	
	//auto unload
	if( this.module[name].autoload){
	    this[name+'_unload'](socketID);
	}
	
	//unset all functions
	for( let expName in this.module[name]){
	    delete this[name+'_'+expName];
	}	

	//unset commands
	
	for( let moduleName in this.module[name].command){		
	    delete this['module_'+moduleName];
	    delete this.options.list_command[moduleName];
	    delete this.options.list_usage_command[moduleName];
	    delete this.options.list_auto_command[moduleName];
	    this.emit('del_autocomplete',moduleName);
	}
	
	//unload module
	delete require.cache[require.resolve(path+name)];
	delete this.module[name];
	this.list_modules[name] = false;
	
	if( socketID !== null){
	    this.emit(socketID,'unload '+name);
	}
    },
    start_modules : function(){
	for( let name in coreModules){
	    this._load_module(null,name,corePath);
	}
	for( let name in this.options.modules){
	    if( this.options.modules[name]){
		this._load_module(null,name,this.options.path);
	    }
	}
	
	this.on('command:load_module',this._load_module);
	this.on('command:unload_module',this._unload_module);
    }
}

