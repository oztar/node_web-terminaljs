'use strict'
let ee = require('../').ee;
let j  = require('../').options;
let u  = require('../').u;//utils

const name = 'verbose';
let level = 0;

//list of error, usage with utils
const errors = {
    NOT_FOUND    : 'Command not found',
    USAGE        : 'Arguments error, using help OR help usage '+name,
    UNDEFINED    : '%s internal error:'+"\r\n"+'%s'
};

//emit terminal error
//ee.emit(socketID+'err',u(errors['UNDEFINED'],'Module Unload',e));

//emit print terminal
//ee.emit(socketID,'Module\t'+name);
const _verbose = (socketID,args)=>{
    try{
	if( args[1] === undefined){
	    _level(socketID,0);
	    return;
	}
	if( parseInt(args[1])){
	    _level(socketID,args[1]);
	    return;
	}

	ee.emit(socketID+'err',errors['USAGE']);

    }catch(e){
	ee.emit(socketID+'err',u(errors['UNDEFINED'],'Module',e));
    }
}

const _level = (socketID,numlevel)=>{
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
const _welcome = (socketID)=>{
    for(let l=1;l<= level;l++){ 
	_on_socket(l,socketID);
    }
}


const _on_socket = (level,socketID)=>{
    j.ioc[socketID].join('LOG'+level); 
}


const _off_socket = (level,socketID)=>{
    j.ioc[socketID].leave('LOG'+level);
}
//mandatory for require module
const load = (socketID)=>{
    
    // name command   <function>
    ee.on(name,_verbose);
    ee.on('send_welcome',_welcome);

    //create mem internal for name command - Information 
    j.list_command[name]= 'Log level info in console';

    //create info for usage comand 
    j.list_usage_command[name]  = name+' <level>'+"\r\n";

    //create array to autocomplete terminal commands
    j.list_auto_command[name] = null;//not arguments

    //emit to terminal the autocomplete value
    ee.emit('send_autocomplete',name,j.list_auto_command[name]);


}


//mandatory for require unload module
const unload = (socketID)=>{
    //delete 
    ee.off(name,_verbose);
    ee.off('send_welcome',_welcome );
    for(let l=1;l<=level;l++){ 
	_off_socket(l,socketID);
    }

    //deletes infos, usages and autocompletes
    delete j.list_command[name];
    delete j.list_usage_command[name];
    delete j.list_auto_command[name];
    ee.emit('del_autocomplete',name);
}


module.exports = {
load,
unload
}
