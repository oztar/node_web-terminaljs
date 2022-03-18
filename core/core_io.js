'use strict'
const nonce = function(length) {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for(var i = 0; i < length; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
}

module.exports = function(){
    const tio = this.options.io.of('/'+this.options.io_name_space);
    tio.on('connection', socket =>{
	socket.join('Loge');//Log Error
	
	//funciones
	const send_socket = (req)=>{
	    socket.emit('result:command',req);
	}
	
	const send_err_socket = (req)=>{
	    socket.emit('result:error',req);
	}
	
	const send_autocomplete = (con,args)=>{
	    socket.emit('update:command',con,args);
	}
	
	const emit_terminal = (con)=>{
	    try{
		if( this.user[socket.id].loged == 1 ){
		    let d = con.split(' ');	
		    if(this.options.list_command[d[0]] === undefined){
			socket.emit('result:error','command not found');
			return;
		    }
		    
		    this['module_'+d[0]](socket.id,d);
		    
		}
	    }catch(e){
		return;
	    }
	}
	
	const send_welcome = ()=>{
	    //start coneccion IO
	    if( this.user[socket.id] === undefined){this.user[socket.id] = {loged :0};}
	    
	    if(!this.options.login){
		this.user[socket.id].loged = 1;
		this._welcome(socket.id);
	    }else{
		socket.emit('login');
	    }
	}
	const _unlogin = function(){socket.emit('login');}
	
	const _login = (name)=>{
	    this.user[socket.id] = {
		id    : socket.id,
		loged : 0,
		user  : name,
		nonce : nonce(16)
	    };
	    socket.emit('password',this.user[socket.id].nonce);
	}
	
	const _pass = (md5pass)=>{
	    this.user[socket.id].pass = md5pass;
	    this.login(this.user[socket.id]);
	}
	
	const _loged = ()=>{
	    this.user[socket.id].loged = 1;
	    socket.emit('loged',this.user[socket.id].user);
	    this._welcome(socket.id);
	}
	
	const del_autocomplete = function(con){
	    socket.emit('delete:command',con);
	}
	
	const close_socket = ()=>{
	    this.off(socket.id,send_socket);
	    this.off(socket.id+'err',send_err_socket);
	    this.off('send_autocomplete',send_autocomplete);
	    this.off('del_autocomplete',del_autocomplete);
	    delete this.client_socket[socket.id];
	}
	
	const _verbose = (level)=>{
	    socket.join('LOG'+level); 
	}
	
	
	//internal listeners generic
	this.on('send_autocomplete',send_autocomplete);
	this.on('del_autocomplete',del_autocomplete);
	this.on('LOGe',send_err_socket);
	
	//internal listeners unicast
	this.on(socket.id,send_socket);
	this.on(socket.id+'err',send_err_socket);
	this.on(socket.id+'login|true',_loged);
	this.on(socket.id+'login|false',_unlogin);
	
	//socket listeners
	socket.on('terminal:command',emit_terminal);
	socket.on('welcome',send_welcome);//start socket
	socket.on('loginName',_login);//start socket
	socket.on('loginPass',_pass);//start socket

	this.client_socket[socket.id] = socket;
    });
    this.options.io = tio;
}
