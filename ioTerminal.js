'use strict'

module.exports = function(io){
    const ee  = require('./').ee;
    const j   = require('./').options;
    const tio = io.of('/terminal');

    tio.on('connection', socket =>{
	socket.join('Loge');

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
	    let d = con.split(' ');	
	    if(j.list_command[d[0]] === undefined){
		socket.emit('result:error','command not found');
		return;
	    }
	    ee.emit(d[0],socket.id,d);
	}
	const send_welcome = ()=>{
	    //start coneccion IO
	    ee.emit('send_welcome',socket.id);

	    //msg welcome
	    let welcome ="\r\n";
	    welcome +=' #     # ####### #        #####  ####### #     # #######       '+"\r\n";
	    welcome +=' #  #  # #       #       #     # #     # ##   ## #             '+"\r\n";
	    welcome +=' #  #  # #       #       #       #     # # # # # #             '+"\r\n";
	    welcome +=' #  #  # #####   #       #       #     # #  #  # #####         '+"\r\n";
	    welcome +=' #  #  # #       #       #       #     # #     # #             '+"\r\n";
	    welcome +=' #  #  # #       #       #     # #     # #     # #             '+"\r\n";
	    welcome +='  ## ##  ####### #######  #####  ####### #     # #######       '+"\r\n";
	    welcome +='                                                               '+"\r\n";
	    welcome +='    ####### ####### ######  #     # ### #     #    #    #      '+"\r\n";
	    welcome +='       #    #       #     # ##   ##  #  ##    #   # #   #      '+"\r\n";
	    welcome +='       #    #       #     # # # # #  #  # #   #  #   #  #      '+"\r\n";
	    welcome +='       #    #####   ######  #  #  #  #  #  #  # #     # #      '+"\r\n";
	    welcome +='       #    #       #   #   #     #  #  #   # # ####### #      '+"\r\n";
	    welcome +='       #    #       #    #  #     #  #  #    ## #     # #      '+"\r\n";
	    welcome +='       #    ####### #     # #     # ### #     # #     # #######'+"\r\n";
	    welcome +='jquery version v3.41.1. \n';
	    welcome +='jquery terminal version v2.29.2 \n';
	    welcome +='Web Terminal Js CLI version v0.0.1.';
	    socket.emit('result:command',welcome);


	    //send list autocoplete for socket
	    for( let id in j.list_auto_command){
		socket.emit('update:command',id,j.list_auto_command[id]);
	    }

	}
	const del_autocomplete = (con)=>{
	    socket.emit('delete:command',con);
	}
	const close_socket = ()=>{
	    ee.off(socket.id,send_socket);
	    ee.off(socket.id+'err',send_err_socket);
	    ee.off('send_autocomplete',send_autocomplete);
	    ee.off('del_autocomplete',del_autocomplete);

	}
	const _verbose = (level)=>{
	    socket.join('LOG'+level); 
	}


	//internal listeners
	ee.on('send_autocomplete',send_autocomplete);
	ee.on('del_autocomplete',del_autocomplete);
	ee.on(socket.id,send_socket);
	ee.on(socket.id+'err',send_err_socket);
	ee.on('LOGe',send_err_socket);

	//socket listeners
	socket.on('terminal:command',emit_terminal);
	socket.on('welcome',send_welcome);//start socket
	
	j.ioc[socket.id] = socket;
    });
    j.io = tio;
    return io;
}
