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
    UNDEFINED    : '%s internal error:'+"\r\n"+'%s'
};

const _help = function(socketID,args){
    try{
	let response = 'Help command:'+"\n\r";
	if( args[1] === undefined){
	    
	    for( let com in j.list_command){
		response += com+'\t'+j.list_command[com]+"\n\r";
	    }
	}else if( args[1] == 'usage'){
	    if(  j.list_command[args[2]] === undefined){
		ee.emit(socketID+'err',errors['NOT_FOUND']);
		return;
	    }else{
		response += j.list_usage_command[args[2]];
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

const _saveConfig = function(socketID,args){
    ee.emit('save:config',j.modules);
    ee.emit(socketID,'Save Config');
}

const load = (socketID)=>{
    ee.on('help',_help);
    ee.on('module',_module);
    ee.on('save',_saveConfig);
    j.list_command['help']= 'Info';
    j.list_command['save']= 'Grabar Configuracion';
    j.list_command['module']= 'Module - Commands Modules';
    j.list_usage_command['help']  = 'help - List command available'+"\r\n";
    j.list_usage_command['help'] += 'help usage <command>';
    j.list_usage_command['module']  = 'module load<name>'+"\r\n";
    j.list_usage_command['module'] += 'module  show - List modules loaded'+"\r\n";
    j.list_usage_command['module']+= 'module unload  <name>';
    j.list_auto_command['help'] = ['usage'];
    j.list_auto_command['save'] = [''];
    j.list_auto_command['module'] = ['show','reload','load','unload','list'];
    ee.emit('send_autocomplete','help',j.list_auto_command['help']);
    ee.emit('send_autocomplete','module',j.list_auto_command['module']);
}

const unload = (socketID)=>{
    ee.off('help',_help);
    ee.off('module',_module);
    ee.off('save',_saveConfig);
    delete j.list_command['help'];
    delete j.list_command['module'];
    delete j.list_usage_command['help'];
    delete j.list_usage_command['module'];
    delete j.list_auto_command['help'];
    delete j.list_auto_command['module'];
    ee.emit('del_autocomplete','help');
    ee.emit('del_autocomplete','module');
    ee.emit('del_autocomplete','module unload');
    ee.emit('del_autocomplete','module load');
}
module.exports = {
    load,
    unload
}
