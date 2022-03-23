'use strict'
const u  = require('util').format;//utils
const fs = require('fs');

const errors = {
    NOT_FOUND    : 'Command not found',
    USAGE        : 'Help usage module\r\n %s its not argument',
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
	    
	    for( let com in this.options.list_command){
		response += this.f.col(com,0);
		response += this.f.col(this.options.list_command[com],0);
		response += "\n\r";
	    }
	}else if( args[1] == 'usage'){
	    if(  this.options.list_command[args[2]] === undefined){
		this.emit(socketID+'err',errors['NOT_FOUND']);
		return;
	    }else{
		response += this.f.col(this.options.list_usage_command[args[2]],0);
	    }
	}else{
	    this.emit(socketID+'err',errors['HELP_USAGE']);
	    return;
	}
	this.emit(socketID,response);
    }catch(e){
	this.emit(socketID+'err',u(errors['UNDEFINED'],'Help',e));
    }
}


const module_show = function(socketID,args){
    let msg = 'Name\t\tLoaded\tCommand\t\tDescription\r\n';
    let pasa;
    for( let name in this.module){
	pasa = 0;
	msg += this.f.col(name,0);
	if( this.list_modules[name]){
	    msg += this.f.col(this.f.color('Load','green'),0);
	     for( let con in this.module[name].command){
		 if( pasa == 1){msg +='\t\t\t\t\t';}
		 msg += this.f.col(con,0);
		 msg += this.f.col(this.f.col(this.module[name].command[con].description,0),0);
		 msg += '\r\n';
		 pasa = 1;
	     }
	}else{
	    msg += this.f.color('UnLoad','red');
	}
    	msg += '\r\n';
    }
   this.emit(socketID,msg); 
}


const module_load = function(socketID,args){
    try{	
	if( args[2] === undefined){
	    this.emit(socketID+'err',errors['LOAD_USAGE']);
	    return;
	}

	if( fs.existsSync(this.options.path+args[2]+'.js') ){
    
	    this._load_module(socketID,args[2] ,undefined,true);
	    return;

	}else{
	    this.emit(socketID+'err',u(errors['UNDEFINED'],'Module Load',' Not exist'));
	    if( this.options.verbose >= 2){
		this.emit('LOG',1,'Not found Module \r\n in '+this.options.path+args[2]+'.js');
	    }
	}

    }catch(e){ 
	this.emit(socketID+'err',u(errors['UNDEFINED'],'Module Load',e));
    }
}

const module_unload = function(socketID,args){
    try{
	if( args[2] === undefined){
	    this.emit(socketID+'err',errors['UNLOAD_USAGE']);
	    return;
	}
	if( this.list_modules[args[2]] !== undefined){
	    if(  this.list_modules[args[2]]){ 
		this._unload_module(socketID,args[2]);
		return;
	    }
	}

	this.emit(socketID+'err',u(errors['UNDEFINED'],'Module UnLoad',' Not exist'));
	
    }catch(e){ 
	this.emit(socketID+'err',u(errors['UNDEFINED'],'Module Unload',e));
    }
}
const module_list = function(socketID,args){
    if (! fs.existsSync(this.options.path)) {
	this.emit(socketID+'err',u(errors['PATH'],this.options.path)); 
	return;
    }
    
    fs.readdir(this.options.path, (err, files) => {
	let msg = 'Module\t\tName\t\tLoaded\r\n';
	files.forEach(name => {
	    name = name.replace('.js','');
	    if( name != 'default'){
		msg += 'Module\t';
		msg += name+'\t';
		if( this.list_modules[name]){
		    msg += this.f.color('Load','green');
		}else{
		    msg += this.f.color('unLoad','red');
		}
		msg += '\r\n';
	    }	
	});
	this.emit(socketID,msg);
    });
}

const modules = function(socketID,args){    
    try{
	this.emit(socketID,args[1]);
	if( this['wtm_utils_module_'+args[1]] !== undefined){
	    this['wtm_utils_module_'+args[1]](socketID,args);
	    return;
	}else if( args[1] == 'reload'){
	    this.wtm_utils_module_unload(socketID,args);
	    this.wtm_utils_module_load(socketID,args);	
	    return;
	}
	
	this.emit(socketID+'err',u(errors['USAGE'],args[1]));

    }catch(e){ 
	this.emit(socketID+'err',u(errors['UNDEFINED'],'Module',e));
    }
}

const save = function(socketID,args){
    this.emit('save:config',this.options.modules);
    this.emit(socketID,'Save Config sended');
}

module.exports = {
    command : {
	'help' : {
	    description : 'Info',
	    usage : 'help - List command available\r\nhelp usage <command>',
	    auto  : ['usage']
	},
	'module' : {
	    description : 'Module - Commands Modules',
	    usage : 'module load <name> - load custom module\r\nmodule unload <name> - drop load custom module \r\nmodule reload <name> Restart custom module \r\nmodule  show - List modules loaded\r\nmodule list -  List All custom modules in folder',
	    auto  : ['show','reload','load','unload','list']
	},
	'save' : {
	    description : 'Save module list loaded',
	    usage : 'save',
	    auto  : ['']
	}
    },
    help,
    module : modules,
    module_show,
    module_load,
    module_unload,
    module_list,    
    save,
    autoload : false
}
