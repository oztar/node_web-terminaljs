'use strict'

const nameCon = {
    description : 'description',
    usage : 'name [option1|option2...]',
    auto  : ['option1','option2']  //or null
}


const name = function(socketID,args){
    try{
	this.emit(socketID,'Name example: echo '+this.f.color(args[1],'violet'));
	/*
	  socketID       - is a uniqueid for print screen 
	  socketID+'err' - is a uniqueid for print screen in RED color. Recomend Using for errors
	  args     - array
	*/

	// your code here
    }catch(e){
	this.emit(socketID+'err',e);
   }
}

/*
  the modules not need commands
  you use other events, and other code. 
    
  autoload is true you using Load and Unload for module. 
  const load = function(socketID){}
  const unload = function(socketID){}
*/

module.exports = {
    command : {
	name : nameCon
    },
    name,
    autoload : false
}
