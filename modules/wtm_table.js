'use strict'

const u       = require('util').format;

    
const nameCon = {
    description : 'Create tablas witch json in formated console',
    usage : 'emit(table,{table})',
    auto  : []  //or null
}

const errors ={
    USAGE        : 'this.emit(\'table\',socketID,json_dats)\n\rthis.emit(\'table\',LOGx,json_dats)',
    ARGUMENT     : 'need arguments',
    UNDEFINED    : '%s internal error:'+"\r\n"+'%s',
    NOT_FOUND    : '"%s" not found in %s'
}
const reg = /\[\[;[a-zA-Z]*;\](.*)\]/


const table = function(socketID){
    try {
	if( arguments[1] === undefined){
	    this.emit(socketID+'err',u(errors['ARGUMENT']));
	    return;
	}
	let tableid = argumens[2] || false;
	
	let table = create_table(arguments[1],tableid);
	
	this.emit(socketID,table.table);

	
    }catch(e){
	this.emit(socketID+'err',u(e));
    }
}
const table_format = function(socketID){
    try {	
	if( arguments[1] === undefined){
	    this.emit(socketID+'err',u(errors['ARGUMENT']));
	    return;
	}

	
	let arg = arguments[1];
	arg.title   = arg.title   || '';
	arg.head    = arg.head    || {};
	arg.tableid = arg.tableid || false;

	let t = '\t';
	let table = create_table(arg.table, arg.tableid);	

	//creamo la cabecera
	let head  = '';
	if( arg.tableid){
	    head  = 'ID'+t.repeat(table.distance['_line']);
	}
	for(let col in arg.head){
	    let dis = Math.floor(arg.head[col].length/4);
	    head += arg.head[col]+t.repeat(table.distance[col]-dis);
	}
	head +='\n\r';


	//creamos la visualizacion final
	table.table = arg.title+'\n\r'+head+table.table;//anañdimos cabeceras
	
	if( arg.table.length >= 10){
	    table.table+head; //añadimos cabecera final, para no perdernos.
	}



	//imprimimos por pantalla
	this.emit(socketID,table.table);

	
    }catch(e){
	this.emit(socketID+'err',u(e));
    }
}
const Mathdistance = function(dis){
    let ndis = dis.match(reg);
    if( ndis === null){
	return dis.toString().length;
    }
    return ndis[1].length;
}
const create_table = function(dats,tableid){
    try{

	let table = '';
	let distance = {};
	for(let line in dats){	    
	    distance['_line'] = Mathdistance(line);
	    for( let col in dats[line]){
		let dis = Mathdistance(dats[line][col]);//obtenemos la distancia
		
		if( distance[col] === undefined){
		    distance[col] = dis;//si no existe la creamos
		}else if( distance[col] < dis) {
		    distance[col] = dis;//si es menor a actual, actualizamos
		}
	    }
	}

	for(let col in distance ){
	    distance[col] = Math.ceil(distance[col]/4)+1;//sacamos cuantas \t necesitamos por columna
	}

	let t = '\t';
	let dis;
	for(let line in dats){
	    
	    if( tableid){//printamos por pantalla el id de linea
		dis = Math.floor(Mathdistance(line)/4);
		table += line+t.repeat(distance['_line']-dis);
	    }
	    
	    for( let col in dats[line]){
		dis = Math.floor(Mathdistance(dats[line][col])/4);//obtenemos la cantidad de \t que tiene el texto, para restarselo a la columna
		table += dats[line][col]+t.repeat(distance[col]-dis);
	    }
	    table +='\n\r';
	}

	return {table,distance};

	
    }catch(e){
	return { 'table' : u('table error construct',e) ,distance : []};
   }
}
const load = function(socketID){
    this.on('table',table);
    this.on('tablef',table_format);
}
const unload = function(socketID){
    this.off('table',table);
    this.off('tablef',table_format); 
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
    load,
    unload,
    autoload : true
}
