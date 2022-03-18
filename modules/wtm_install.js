'use strict'
const u     = require('util').format
const https = require('https');
const fs    = require('fs');
const crypto= require('crypto');

const repoMaxTime = 300000;//300 seconds
let repoTime = 0;

const md5checksum = async function(str){    
   return await crypto.createHash('md5').update(str).digest("hex");   
}

async function get_page(dirurl) {
    let data = '';
    return new Promise((resolve) => {
        const a = https.get(dirurl, res => {
            res.on('data', chunk => { data += chunk }) 
            res.on('end', () => {
		resolve(data);
            })
        }) 
	a.setTimeout( 10000, function( ) {
	     resolve('timeout');
	});
    })
}


const errors = {
    PATH         : 'Path not found \r\n %s',
    USAGE        : 'Arguments error, using help \t\n OR help usage install',
    UNDEFINED    : '%s internal error: \r\n %s',
    NOT_INSTALL  : 'Module wtm %s not installed',
    NOT_EXIST    : 'Module wtm %s not exist in repositorie\r\nUpdate list with command "install update". ',
    UNDEFINED    : '%s internal error: \r\n %s\r\n%s'
};

//BASE command
const install = function(socketID,args){
    try{
	if( this['wtm_install_'+args[1]] === undefined){
	    this.emit(socketID+'err', u(errors['USAGE']))
	    return;
	}
	this['wtm_install_'+args[1]](socketID,args);
    }catch(e){
	this.emit(socketID+'err',u(e));
   }
}

//update list repositories
const update = function(socketID,args){
    if( parseFloat(repoTime+repoMaxTime) > Date.now()){ 
	this.emit(socketID,'Not Updating\r\ntime between update too short');
	return;
    }
    repoTime = Date.now();
    this.emit(socketID,'Updating');
    get_page('https://raw.githubusercontent.com/oztar/wtm/main/list.json')
	.then( result=>{
	    try{
		this.repo = JSON.parse(result);
		this.emit(socketID,'Repositorie updated');
	    }catch(e){
		this.emit(socketID+'err',u(errors['UNDEFINED'],'Result HTTPS JSON',e,result));
	    }
	}); 
    return;
}

//install function 
const modules = function(socketID,args){
    try {   
	if( args[2] === undefined){ 
	    this.emit(socketID+'err', u(errors['USAGE']));
	    return;
	}

	// more time witch out install update, force update
	if( parseFloat(repoTime+repoMaxTime) < Date.now()){ 
	    this.wtm_install_update(socketID,args);
	}

	const spliter = args[2].split('@');//separated for version module@version

	if( this.repo[spliter[0] ] === undefined){
	    this.emit(socketID+'err',u(errors['NOT_EXIST'],args[2])); 
	    return;
	}

	if( spliter[1] === undefined){spliter[1] = this.repo[spliter[0] ].lasted}
	
	const realmodule = this.repo[spliter[0]][spliter[1]].file;
	this.emit(socketID,'module download '+spliter[0]+' version '+spliter[1]);
	this.emit(socketID+'progress',0);
	get_page('https://raw.githubusercontent.com/oztar/wtm/main/wtm_'+realmodule)
	    .then( result=>{
		try{
		    const md5 = md5checksum(result)
			.then( md5checksum =>{
			    if( md5checksum == this.repo[spliter[0]][spliter[1]].md5){
				this.emit(socketID,'module installing');
				this.emit(socketID+'progress',50);
				const data = new Uint8Array(Buffer.from(result));
				fs.writeFile(this.options.path+spliter[0]+'.js', data, (err)=>{
				    if (err) {
					this.emit(socketID+'progress',-1);
					this.emit(socketID+'err','Error record Module\r\nNot installed');
					return
				    }
				    this.emit(socketID+'progress',75);
				    this.emit(socketID,'module waiting to load '+spliter[0]);
				    this._load_module(socketID,''+spliter[0]);
				    this.emit(socketID+'progress',100);
				});
			    }else{
				this.emit(socketID+'progress',-1);
				this.emit(socketID+'err','Error in checksum this module\r\nNot installer for security');
			    }
			});
		}catch(e){
		    this.emit(socketID+'progress',-1);
		    this.emit(socketID+'err',u(errors['UNDEFINED'],'Result HTTPS JSON',e,result));
		}
	    });  
	
    }catch(e){
		this.emit(socketID+'err',u(errors['UNDEFINED'],'Install',e,''));
    }
}



//uninstall funcion
const remove  = function(socketID,args){  
    //si no envia argumento no hacemos nada
    if( args[2] === undefined){ 
	this.emit(socketID+'err', u(errors['USAGE']));
	return;
    }

    //si no existe la carpeta, no hacemos nada
    if (! fs.existsSync(this.options.path)) {
	this.emit(socketID+'err',u(errors['PATH'],this.options.path)); 
	return;
    }
    //si no esta instalado no hacemos nada
    if( this.list_modules[args[2]] === undefined){ 
	this.emit(socketID+'err',u(errors['NOT_INSTALL'],args[2]));
	return;
    }

    //unload module
    this.emit(socketID+'progress',0);
    try{
	if( this.list_modules[args[2]]){
	    this._unload_module(socketID,args[2]);
	}
    }catch(e){
	this.emit(socketID+'progress',-1);
	this.emit(socketID+'err',u(errors['UNDEFINED'],'unload module',args[2],e));
	return
    }
    
    try{
	this.emit(socketID+'progress',10);
	fs.unlink(this.options.path+args[2]+'.js', (err) => {
	    if (err) {
		this.emit(socketID+'progress',-1);
		this.emit(socketID+'err',u(errors['UNDEFINED'],'Remove module',args[2],e));
		return
	    }
	    this.emit(socketID+'progress',100);
	    this.emit(socketID,'module removed');
	})
    }catch(e){
	this.emit(socketID+'progress',-1);
	this.emit(socketID+'err',u(errors['UNDEFINED'],'unload module',args[2],e));
	return
    }
}

//checksum function
const checksum  = function(socketID,args){  
    //si no envia argumento no hacemos nada
    if( args[2] === undefined){ 
	this.emit(socketID+'err', u(errors['USAGE']));
	return;
    }

    //si no existe la carpeta, no hacemos nada
    if (! fs.existsSync(this.options.path)) {
	this.emit(socketID+'err',u(errors['PATH'],this.options.path)); 
	return;
    }
    //si no esta instalado no hacemos nada
    if( this.list_modules[args[2]] === undefined){ 
	this.emit(socketID+'err',u(errors['NOT_INSTALL'],args[2]));
	return;
    }

    const data = fs.readFileSync(this.options.path+args[2]+'.js', {encoding:'utf8', flag:'r'});
    const md5 = md5checksum(data)
	.then( result=>{
	    this.emit(socketID,u(result));
	});
}


//search function
const search = function(socketID,args){ 
    let res ='';
    let pasa =0;
    if( args[2] !== undefined){
	 this.emit(socketID,'filter: '+args[2]);
    }
    for( let i in this.repo){
	if( args[2] !== undefined){
	    if( args[2] != i){continue;}
	}
	pasa = 0;
	res += this.f.col(i,0);
	for( let v in this.repo[i]){
	    if( pasa == 1){ res += '\t\t\t';}
	    res += v;
	    res +='\r\n';
	    pasa = 1;
	}

	res +='\r\n';
    }
    this.emit(socketID,res);
}
module.exports = {
    command : {
	install : {
	    description : 'System Instalation Repositorie',
	    usage : 'name [module|remove|update|checksum|search]',
	    auto  : ['module','remove','update','checksum','search']  //or null
	}
    },
    install,
    module : modules,
    remove,
    update,
    search,
    checksum,
    autoload : false
}
