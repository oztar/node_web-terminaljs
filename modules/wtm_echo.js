'use strict'
let u  = require('util').format;//utils

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
	    this.emit(socketID,'echo null');
	    return;
	}else{
	    this.emit(socketID,this.f.color(args[1],'violet'));
	}
    }catch(e){
	this.emit(socketID+'err',u(errors['UNDEFINED'],'verbose',e));
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
