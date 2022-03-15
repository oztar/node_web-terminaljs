'use strict'
let ee = require('../').ee;
let j  = require('../').options;
let u  = require('../').u;//utils

let level = j.verbose;

//list of error, usage with utils
const errors = {
    NOT_FOUND    : 'Command not found',
    USAGE        : 'Arguments error, using help OR help usage verbose',
    UNDEFINED    : '%s internal error:'+"\r\n"+'%s'
};

const verbose = function(socketID,args){
    try{
	if( args[1] === undefined){
	    ee.emit(socketID,'verbose level is '+level);
	    return;
	}
	if( parseInt(args[1])){
	    _level(socketID,args[1]);
	    return;
	}else{
	    _level(socketID,0);
	    return;
	}

    }catch(e){
	ee.emit(socketID+'err',u(errors['UNDEFINED'],'verbose',e));
    }
}

const _level = function(socketID,numlevel){
    try{
	if(  numlevel >= 10){numlevel =9;}//security
	
	//change level
	for( let l=1;l<= 9;l++){
	    if( l > level && l <= numlevel){
		_on_socket(l,socketID);
	    }else if( l <= level && l > numlevel){
		_off_socket(l,socketID);
	    }
	}
	//save level
	level = numlevel;
	
	//terminal 
	ee.emit(socketID,'verbose in level '+level);
    }catch(e){
	ee.emit(socketID+'err',u(errors['UNDEFINED'],'Module',e));
    }
}
const _welcome = function(socketID){
    for(let l=1;l<= level;l++){ 
	_on_socket(l,socketID);
    }
}


const _on_socket = function(level,socketID){
    j.ioc[socketID].join('LOG'+level); 
}


const _off_socket = function(level,socketID){
    j.ioc[socketID].leave('LOG'+level);
}
//mandatory for require module
const load = function(socketID){
    ee.on('send_welcome',_welcome);
}


//mandatory for require unload module
const unload = function(socketID){
    for(let l=1;l<=level;l++){ 
	_off_socket(l,socketID);
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
    verbose,
    load,
    unload,
    autoload : true
}
