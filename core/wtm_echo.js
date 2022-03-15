'use strict'
let ee = require('../').ee;
let j  = require('../').options;
let u  = require('../').u;//utils

//list of error, usage with utils
const errors = {
    NOT_FOUND    : 'Command not found',
    USAGE        : 'Arguments error, using help OR help usage verbose',
    UNDEFINED    : '%s internal error:'+"\r\n"+'%s'
};

const echoCon = {
    description : 'Response same txt console',
    usage : 'echo <txt>',
    auto  : null
}

const echo = function(socketID,args){
    try{
	if( args[1] === undefined){
	    ee.emit(socketID,'echo null');
	    return;
	}else{
	    ee.emit(socketID,j.f.color(args[1],'violet'));
	}
    }catch(e){
	ee.emit(socketID+'err',u(errors['UNDEFINED'],'verbose',e));
    }
}
const load = function(socketID){}
const unload = function(socketID){}

module.exports = {
    command : {
	echo : echoCon
    },
    echo,
    load,
    unload,
    autoload : false
}
