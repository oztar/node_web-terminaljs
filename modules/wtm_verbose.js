'use strict'
const u  = require('util').format;//utils

let level = 0;

//list of error, usage with utils
const errors = {
    NOT_FOUND    : 'Command not found',
    USAGE        : 'Arguments error, using help OR help usage verbose',
    UNDEFINED    : '%s internal error:'+"\r\n"+'%s'
};

const verbose = function(socketID,args){
    try{
	if( args[1] === undefined){
	    this.emit(socketID,'verbose level is '+level);
	    return;
	}

	if( parseInt(args[1])){
	    this.wtm_verbose_flevel(socketID,args[1]);
	    return;
	}else{
	    this.wtm_verbose_flevel(socketID,0);
	    return;
	}

    }catch(e){
	this.emit(socketID+'err',u(errors['UNDEFINED'],'verbose',e));
    }
}

const flevel = function(socketID,numlevel){
    try{
	if(  numlevel >= 10){numlevel =9;}//security
	
	//change level
	for( let l=1;l<= 9;l++){
	    if( l > level && l <= numlevel){
		this.wtm_verbose_on_socket(l,socketID);
	    }else if( l <= level && l > numlevel){
		this.wtm_verbose_off_socket(l,socketID);
	    }
	}
	//save level
	level = numlevel;
	
	//terminal 
	this.emit(socketID,'verbose in level '+level);
    }catch(e){
	this.emit(socketID+'err',u(errors['UNDEFINED'],'Module',e));
    }
}
const welcome = function(socketID){
    for(let l=1;l<= level;l++){ 
	this.wtm_verbose_on_socket(l,socketID);
    }
}


const on_socket = function(level,socketID){
    this.client_socket[socketID].join('LOG'+level); 
}


const off_socket = function(level,socketID){
    this.client_socket[socketID].leave('LOG'+level);
}
//mandatory for require module
const load = function(socketID){
    level = this.options.verbose;
    this.on('send_welcome',this.wtm_verbose_welcome);
}

//mandatory for require unload module
const unload = function(socketID){
    for(let l=1;l<=level;l++){ 
	this.wtm_verbose_off_socket(l,socketID);
    }
}


module.exports = {
    command : {
	'verbose' : {
	    description : 'Log level info in console',
	    usage : 'verbose <level>',
	    auto  : null
	}
    },
    on_socket,
    off_socket,
    welcome,
    verbose,
    flevel,
    load,
    unload,
    autoload : true
}
