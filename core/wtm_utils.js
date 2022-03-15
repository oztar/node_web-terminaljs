'use strict'
const ee = require('../').ee;
const j  = require('../').options;
const u  = require('../').u;//utils
const fs = require('fs');

const errors = {
    NOT_FOUND    : 'Command not found',
    HELP_USAGE   : 'Help arguments error, using help OR help usage <command>',
    LOAD_USAGE   : 'Load arguments error. "help usage load" ',
    UNLOAD_USAGE : 'Unload arguments error. "help usage unload" ',
    PATH         : 'Path not found \r\n %s',
    UNDEFINED    : '%s internal error: \r\n %s'
};

const help = function(socketID,args){
    try{
	let response = 'Help command:'+"\n\r";
	if( args[1] === undefined){
	    
	    for( let com in j.list_command){
		response += j.f.col(com,0);
		response += j.f.col(j.list_command[com],0);
		response += "\n\r";
	    }
	}else if( args[1] == 'usage'){
	    if(  j.list_command[args[2]] === undefined){
		ee.emit(socketID+'err',errors['NOT_FOUND']);
		return;
	    }else{
		response += j.f.col(j.list_usage_command[args[2]],0);
	    }
	}else{
	    ee.emit(socketID+'err',errors['HELP_USAGE']);
	    return;
	}
	ee.emit(socketID,response);
    }catch(e){
	ee.emit(socketID+'err',u(errors['UNDEFINED'],'Help',e));
    }
}


const _module_show = function(socketID,args){
    for( let name in j.modules){
	if(j.modules[name]){
	    ee.emit(socketID,'Module\t'+name);
	}
    }
}


const _module_load = function(socketID,args){
    try{	
	if( args[2] === undefined){
	    ee.emit(socketID+'err',errors['LOAD_USAGE']);
	    return;
	}

	if( fs.existsSync(j.path+args[2]+'.js') ){

	    ee.emit('command:load_module',socketID,args[2]);
	    return;

	}else{
	    ee.emit(socketID+'err',u(errors['UNDEFINED'],'Module Load',' Not exist'));

	}

    }catch(e){ 
	ee.emit(socketID+'err',u(errors['UNDEFINED'],'Module Load',e));
    }
}

const _module_unload = function(socketID,args){
    try{
	if( args[2] === undefined){
	    ee.emit(socketID+'err',errors['UNLOAD_USAGE']);
	    return;
	}
	if(  j.modules[args[2]]){ 
	    ee.emit('command:unload_module',socketID,args[2]);
	    return;
	}
    }catch(e){ 
	ee.emit(socketID+'err',u(errors['UNDEFINED'],'Module Unload',e));
    }
}
const _module_list =  function(socketID,args){
    if (! fs.existsSync(j.path)) {
	ee.emit(socketID+'err',u(errors['PATH'],j.path)); 
	return;
    }
    
    fs.readdir(j.path, (err, files) => {
	files.forEach(name => {
	    name = name.replace('.js','');
	    if( name != 'default'){
		let msg = 'Module\t';
		msg += name+'\t';
		if( j.modules[name]){
		    msg += j.f.color(j.modules[name],'green');
		}else{
		    msg += j.f.color(j.modules[name],'red');
		}
		ee.emit(socketID,msg);
	    }
	});
    });
}
const module_functions = {
    show : _module_show,
    list : _module_list,
    unload : _module_unload,
    load   : _module_load,
    reload : function(socketID,args){
	_module_unload(socketID,args);
	_module_load(socketID,args);	
    }
}

const _module = function(socketID,args){
    try{
	if( module_functions[args[1]] !== undefined){
	    module_functions[args[1]](socketID,args);
	    return;
	}
	
	ee.emit(socketID+'err',errors['LOAD_USAGE']);

    }catch(e){ 
	ee.emit(socketID+'err',u(errors['UNDEFINED'],'Module',e));
    }
}

const save = function(socketID,args){
    ee.emit('save:config',j.modules);
    ee.emit(socketID,'Save Config sended');
}

const load = function(socketID){}
const unload = function(socketID){}

module.exports = {
    command : {
	'help' : {
	    description : 'Info',
	    usage : 'help - List command available\r\nhelp usage <command>',
	    auto  : ['usage']
	},
	'module' : {
	    description : 'Module - Commands Modules',
	    usage : 'module load<name>\r\nmodule  show - List modules loaded\r\nmodule unload <name>',
	    auto  : ['show','reload','load','unload','list']
	},
	'save' : {
	    description : 'Save module list loaded',
	    usage : 'save',
	    auto  : ['']
	}
    },
    help,
    module :  _module,
    save,
    load,
    unload,
    autoload : false
}
