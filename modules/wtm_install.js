'use strict'
/*
  Author Alfredo Roman
  Description Core Module Install
  Version 0.4
*/

const u     = require('util').format
const https = require('https');
const fs    = require('fs');
const crypto= require('crypto');
const zlib  = require('zlib');
const url   = require('url');

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
	a.setTimeout( 5000, function( ) {
	     resolve('timeout');
	});
    })
}
const unzip_and_load = function(socketID,filegz,spliter){
    let data = fs.readFileSync(filegz);
    this.emit(socketID+'progress',45);
    data = zlib.unzipSync(data);
    this.emit(socketID+'progress',65);

    const md5 = md5checksum(data)
	.then( md5checksum =>{
	    if( md5checksum == this.repo[spliter[0]][spliter[1]].md5){
		this.emit(socketID,u('module installing',md5checksum));
		this.emit(socketID+'progress',75);
		fs.writeFile(this.options.path+spliter[0]+'.js', data, (err)=>{
		    if (err) {
			this.emit(socketID+'progress',-1);
			this.emit(socketID+'err','Error record Module\r\nNot installed');
			return
		    }
		    this.emit(socketID+'progress',98);
		    
		    //auto load installed
		    this.emit(socketID,'module waiting to load '+spliter[0]);
		    this._load_module(socketID,''+spliter[0],undefined,true);
		    this.emit(socketID+'progress',99);
		    this.emit(socketID,'module cleaning '+spliter[0]);
		    fs.unlink(filegz, (e) => {	
			if (e) {
			    this.emit(socketID+'progress',-1);
			    this.emit(socketID+'err',u(errors['UNDEFINED'],'Remove module',args[2],e));
			    return
			}
			this.emit(socketID+'progress',100);			
		    });
		});
	    }else{
		this.emit(socketID+'progress',-1);
		this.emit(socketID+'err','Error in checksum this module\r\nNot installer for security');
	    }
	});
}

const get_file = async function(socketID,dirurl,file,spliter) {
    let lwrite = 0;
    let fwrite;
    let maxbytes = 0; 
    this.emit(socketID+'progress',1);
    const a = https.get(dirurl, response=> {
	if (response.statusCode > 300 && response.headers.location) {	 
	    if (url.parse(response.headers.location).hostname) {
		this.wtm_install_get_file(socketID,response.headers.location,file,spliter);
		return;
		//https.get(response.headers.location),writeToFile);
	    } else {
		this.wtm_install_get_file(socketID,url.resolve(url.parse(TAR_URL).hostname, response.headers.location),file,spliter);
		return;
		//https.get(url.resolve(url.parse(TAR_URL).hostname, response.headers.location),writeToFile);
	    }
	}
	maxbytes = response.headers['content-length'];
	response.on('data', chunk => { 
	    if( fwrite === undefined){
		fwrite = fs.createWriteStream(file);
	    }
	    fwrite.write(chunk);
	    lwrite = parseInt(lwrite+chunk.length);
	    this.emit(socketID+'progress',parseInt(parseInt(lwrite/maxbytes)*25));
	}) 
        response.on('end', ()=> { 
	    fwrite.end(  ()=>{
		this.emit(socketID+'progress',26);
		this.wtm_install_unzip_and_load(socketID,file,spliter);
	    });   
	});
    }) 
    a.setTimeout( 5000, ()=> { 
	this.emit(socketID+'progress',-1);
	this.emit(socketID+'err','Error in timeout this module\r\nNot installer, repositorie not respond');
    });
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
const update = async function(socketID,args){
    if( parseFloat(repoTime+repoMaxTime) > Date.now()){ 
	this.emit(socketID,'Not Updating\r\ntime between update too short');
	return true;
    }
    this.emit(socketID,'Repositorie Updating');
    return await get_page('https://raw.githubusercontent.com/oztar/wtm/main/list.json')
	.then( result=>{
	    try{
		if( result == 'timeout'){
		    this.emit(socketID,'Repositorie  timeout'); 
		    return;
		}
		this.repo = JSON.parse(result);
		this.emit(socketID,'Repositorie Updated');
		repoTime = Date.now();
	    }catch(e){
		this.emit(socketID+'err',u(errors['UNDEFINED'],'Result HTTPS JSON',e,result));
	    }
	    return true;
	}); 
}

//install function 
const modules = async function(socketID,args){
    try {   
	if( args[2] === undefined){ 
	    this.emit(socketID+'err', u(errors['USAGE']));
	    return;
	}

	// more time witch out install update, force update
	if( parseFloat(repoTime+repoMaxTime) < Date.now()){ 
	    await this.wtm_install_update(socketID,args);
	}

	const spliter = args[2].split('@');//separated for version module@version

	if( this.repo[spliter[0] ] === undefined){
	    this.emit(socketID+'err',u(errors['NOT_EXIST'],args[2])); 
	    return;
	}

	if( spliter[1] === undefined){spliter[1] = this.repo[spliter[0] ].lasted}

	if( this.repo[ spliter[0] ][spliter[1]] === undefined){
	    this.emit(socketID+'err',u(errors['NOT_EXIST'],args[2])); 
	    return;
	}

	const version = process.env.npm_package_dependencies_web_terminaljs.substring(1);
	const pversion = parseInt( version.replace(/\./g,''));
	if( this.repo[spliter[0]][spliter[1]].compatible === undefined){this.repo[spliter[0]][spliter[1]].compatible = '0'};
	const cversion = parseInt( this.repo[spliter[0]][spliter[1]].compatible.replace(/\./g,''));
	if( pversion >= cversion ){
	    this.emit(socketID,'\r\nCompatible:\t\t'+this.f.color('accepted','green'));
	}else{
	    this.emit(socketID,'\r\nCompatible:\t\t'+this.f.color('not compatible','red'));
	    this.emit(socketID,'\r\n your version WT is '+version+' module need version >'+this.repo[spliter[0]][spliter[1]].compatible,'red');
	    return;
	}

	
	let realmodule = this.repo[spliter[0]][spliter[1]].file;
	this.emit(socketID,'module download '+spliter[0]+' version '+spliter[1]);
	this.emit(socketID+'progress',0);


	const TAR_URL = 'https://github.com/oztar/wtm/raw/main/' +  realmodule+ '.gz';


	this.wtm_install_get_file(socketID,TAR_URL,this.options.path+spliter[0]+'.js.gz',spliter);
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
	fs.unlink(this.installed[args[2]].path+args[2]+'.js', (e) => {
	    if (e) {
		this.emit(socketID+'progress',-1);
		this.emit(socketID+'err',u(errors['UNDEFINED'],'Remove module',args[2],e));
		return
	    }

	    this.emit(socketID+'progress',99);
	    delete this.installed[args[2]];
	    

	    
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
const checksum  = async function(socketID,args){
    //si no envia argumento no hacemos nada
    if( args[2] === undefined){ 
	this.emit(socketID+'err', u(errors['USAGE']));
	return;
    }

    const [err,md5] = await this.wtm_install_calc_checksum(args[2])
    if(err){
	this.emit(socketID+'err',u(err));
    }else{
	this.emit(socketID,md5);
    }
}

const calc_checksum = async function(name){

    //si no existe la carpeta, no hacemos nada
    if (! fs.existsSync(this.options.path)) {
	return [u(errors['PATH'],this.options.path)];
    }
    //si no esta instalado no hacemos nada
    if( this.list_modules[name] === undefined){ 
	return [u(errors['NOT_INSTALL'],name)];
    }

    const data = fs.readFileSync(this.options.path+name+'.js', {encoding:'utf8', flag:'r'});
    const md5 = await md5checksum(data)
	.then( result=>{
	    return result
	});
    
    return [null,md5];
}


//list function
const list_list = function(socketID,args,list){
    
    let res ='';
    let pasa =0;
    if( args[2] !== undefined){
	 this.emit(socketID,'filter: '+args[2]);
    }
    for( let i in list){
	if( args[2] !== undefined){
	    if( args[2] != i){continue;}
	}
	pasa = 0;
	res += this.f.col(i,0);
	for( let v in list[i]){
	    if( pasa == 1){ res += '\t\t\t';}
	    res += this.f.col(v,0);
	    res += this.f.col(list[i][v],0);
	    res +='\r\n';
	    pasa = 1;
	}

	res +='\r\n';
    }
    this.emit(socketID,res);
}

//search function
const search = function(socketID,args){
    this.wtm_install_list_list(socketID,args,this.repo);
    if( args[2] !== undefined){
	this.wtm_install_info(socketID,args);
    }
}
const list = function(socketID,args){
    this.wtm_install_list_list(socketID,args,this.installed);
}


const info = async function(socketID,args){
    // more time witch out install update, force update
    if( parseFloat(repoTime+repoMaxTime) < Date.now()){
	await this.wtm_install_update(socketID,args);
    }

    let res ='';
    try {
	if( args[2] === undefined){
	    this.emit(socketID,'Error command, please use help usage install');
	    return;
	}

	const spliter = args[2].split('@');//separated for version module@version

	if( this.repo[ spliter[0] ] === undefined){
	    this.emit(socketID+'err',u(errors['NOT_EXIST'],args[2])); 
	    return;
	}

	if( spliter[1] === undefined){spliter[1] = this.repo[spliter[0] ].lasted}

	if( this.repo[ spliter[0] ][spliter[1]] === undefined){
	    this.emit(socketID+'err',u(errors['NOT_EXIST'],args[2])); 
	    return;
	}
	
	const infoAuthor = this.repo[spliter[0]];
	const infoModule = this.repo[spliter[0]][spliter[1]];
	const version = process.env.npm_package_dependencies_web_terminaljs.substring(1);
	const pversion = parseInt( version.replace(/\./g,''));
	if( infoModule.compatible === undefined){infoModule.compatible = '0'};
	const cversion = parseInt( infoModule.compatible.replace(/\./g,''));
	
	res = '\r\nInfo module: '+spliter[0]+'\r\n';
	res += '\r\nAuthor:\t\t\t'+infoAuthor.author;
	res += '\r\nVersion:\t\t'+spliter[1];
	res += '\r\nLicense:\t\t'+infoAuthor.license;
	res += '\r\nMd5:\t\t\t'+infoModule.md5;	    

	if( pversion >= cversion ){
	    res += '\r\nCompatible:\t\t'+this.f.color('accepted','green');
	}else{
	    res += '\r\nCompatible:\t\t'+this.f.color('not compatible','red');
	    res += '\r\n your version WT is '+version+' module need version >'+infoModule.compatible,'red';
	}
	
	res += '\r\nDescription:\t'+infoModule.description;
	this.emit(socketID,res);

    }catch(e){
	this.emit(socketID+'err',u(e));
    }
}

module.exports = {
    command : {
	install : {
	    description : 'System Instalation Repositorie',
	    usage : 'name [module|remove|update|checksum|search,|info|list]',
	    auto  : ['module','remove','update','checksum','search','info','list']  //or null
	}
    },
    install,
    module : modules,
    remove,
    update,
    search,
    info,
    list_list,
    list,
    checksum,
    calc_checksum,
    get_file,
    unzip_and_load,
    autoload : false
}
