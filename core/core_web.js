'use strict'
let options;

module.exports = {
    star_web : function(){	
	if( this.options.app === undefined){throw new Error('web Terminaljs need express() or similar');}
	if( this.options.io  === undefined){throw new Error('web Terminaljs need lib socket.io| use command npm installsocket.io');}
	options = {
	    proto      : this.options.proto,
	    publicip   : this.options.publicip,
	    port       : this.options.port,
	    lngTimeout : this.options.lngTimeout,
	    url        : this.options.url
	};

	this.options.app.use(this.options.url+"basic.js", this._basic);
	this.options.app.use(this.options.url+"wtio.js", this._wtio);
	this.options.app.use(this.options.url, this._html);
    },
    basic : function(req,res){
	const result = "\
window.onkeydown=capturarf5; \
function capturarf5(e){ \
    let code = e.keyCode;\
    if(code == 116)\
    {\
	e.keyCode=114;\
	return false;\
    }};";	
	res.send(result);
    },
    io : function(req,res){
	const result = "const socket = io(IOproto+'://'+IOip+':'+IOport+'/terminal');\
let terminal_command_timeout = 0;\
let terminal_command_date = 0;\
let terminal_time_timeout = 10; \
let terminal_autocomplete = {};\
let terminal;\
function buf2Base64(buffer) {\
    return btoa(String.fromCharCode.apply(null, new Uint8Array(buffer)));\
}\
async function digestMessage(message){\
    const encoder = new TextEncoder();\
    const data = encoder.encode(message);\
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);\
    const hash = await buf2Base64(hashBuffer);\
    return hash;\
}\
function progress(percent, width) {\
    var size = Math.round(width*percent/100);\
    var left = '', taken = '', i;\
    for (i=size; i--;) {\
        taken += '=';\
    }\
    if (taken.length > 0) {\
        taken = taken.replace(/=$/, '>');\
    }\
    for (i=width-size; i--;) {\
        left += ' ';\
    }\
    return '[' + taken + left + '] ' + percent + '%';\
}\
jQuery(function($, undefined) {\
    const comand = function(command) {\
        if (command !== '') {\
	    try {\
		if( terminalUnblockTimeout() == 1){\
		    socket.emit('terminal:command',command);\
		}else{\
		    e = '('+getTimeLeft(terminal_command_timeout)+'s unblocked)';\
		    this.error(new String('System Blocked '+e));\
		}\
	    } catch(e) {\
		terminalUnblockInTime();\
                this.error(new String(e));\
	    }\
        } else {\
	    this.error(new String('empty command using help'));\
        }\
    };\
    terminal = $('#terminal').terminal(comand, {\
	autocompleteMenu: true,	\
	completion: completions,\
        greetings: '',\
        name: 'Web Terminal JS',\
        height: '100%',\
	prompt : 'wt> '\
    });\
    function error(err){\
	terminalUnblockInTime();\
	terminal.error(new String(err));\
    }\
    socket.on('setPront', (result)=>{\
	terminal.set_prompt(result);\
    });\
    socket.on('progress',(porcentual)=>{\
	if( porcentual == -1){\
	    terminal.echo(string + ' [[b;red;]fail]').set_prompt(prompt);\
	    return;\
	}\
	if(porcentual == 0){\
	    prompt = terminal.get_prompt();\
	}\
	string = progress(porcentual, 100);\
	terminal.set_prompt(string);\
	if( porcentual == 100){\
	    terminal.echo(string + ' [[b;green;]ok]').set_prompt(prompt);\
	}\
    });\
    socket.on('loged', (name)=>{\
	terminal.set_mask(false);\
	terminal.set_prompt(name+'@wt> ');\
	terminal.read(name+'@wt> ',comand);\
    });\
    socket.on('login', ()=>{\
	terminal.set_mask(false);\
	terminal.read('login: ',function( name ){\
	    socket.emit('loginName',name);\
	});\
    });\
    socket.on('password', (nonce)=>{\
	terminal.set_mask('').read('pass: ',async function( name ){\
	    const digestBuffer = await digestMessage(nonce+name);\
	    await socket.emit('loginPass',digestBuffer);\
	});\
    });\
    socket.on('result:command', (result)=>{\
	terminalUnblockInTime();\
	if (result !== undefined) {\
	    terminal.echo(new String(result));\
	}\
    });\
    socket.on('result:error',error);\
    socket.emit('welcome','welcome');\
    socket.on('update:command',(ncom,args)=>{\
	terminal_autocomplete[ncom] = args; \
    });\
    socket.on('delete:command', (dcom)=>{\
	delete terminal_autocomplete[dcom];\
    });\
});\
function completions(command, options){\
    try{  \
	let comand = this.get_command().split(' ');\
	if( comand.length <= 2){\
	    completionsv2(comand,this,1,comand[0]);\
	}else if(comand.length >= 3){\
	    let search = '';\
	    for( let i =0; i<=(comand.length-2);i++){\
		search +=comand[i]+' ';\
	    }\
	    completionsv2(comand,this,(comand.length-1),search.substring(0, search.length-1));\
	}\
    }catch(e){\
	console.log(e);\
    }\
}\
function completionsv2(comand,thes,pos,search){\
    let list = [];\
    let regex;\
    try{  \
	if( comand[pos] !== undefined && comand[pos].length == 0){\
	    thes.echo( new String(terminal_autocomplete[search].join('\t')));\
	}else if( comand[pos] !== undefined){\
	    regex = new RegExp('^' +comand[pos]);\
	    for( let id in terminal_autocomplete[search]){\
		let name = terminal_autocomplete[search][id];\
		if( regex.exec(name) != null){\
		    list.push(name);\
		}\
	    }\
	    if( list.length == 1){\
		thes.set_command(search+' '+list[0]);\
	    }else{\
		thes.echo( new String(list.join('\t')));\
	    }\
	}else if(terminal_autocomplete[search] !== undefined){\
	    thes.echo( new String(terminal_autocomplete[search].join('\t')));\
	}else {\
	    regex = new RegExp('^' +comand+'[^ ]+$');\
	    for( let name in terminal_autocomplete){\
		if( regex.exec(name) != null){\
		    list.push(name);\
		}\
	    }\
	    if( list.length == 1){\
		thes.set_command(list[0]);\
	    }else{\
		thes.echo( new String(list.join('\t')));\
	    }\
	}\
    }catch(e){\
	console.log(e);\
    }\
}\
function getTimeLeft() {   \
    return Math.ceil(( (terminal_time_timeout*1000+terminal_command_date) - Date.now() ) / 1000);\
}\
function terminalUnblockTimeout(){\
    if( terminal_command_timeout != 0){\
        if ( getTimeLeft(terminal_command_timeout) <= 0){ \
          terminal.error(new String('Command: Error TimeOut'));\
          terminalUnblockInTime();\
          return 1;\
        }\
	return 0;\
    }else{\
	terminal_command_date = Date.now();\
	terminal_command_timeout = setTimeout( ()=>{\
            terminal.error(new String('Command: Error TimeOut'));\
	},terminal_time_timeout*1000);\
	return 1;\
    }\
}\
function terminalUnblockInTime(){\
    if( terminal_command_timeout){\
	clearTimeout(terminal_command_timeout);\
	terminal_command_timeout =0;\
	terminal_command_date = 0;\
    }\
}";
	res.send(result);
    },
    html : function(req,res){
	const result = "<!DOCTYPE html> \
<html lang=\"es\"> \
 <head> \
  <meta charset=\"UTF-8\">\
  <title> Web Terminal Js  </title> \
  <link href=\"https://unpkg.com/jquery.terminal/css/jquery.terminal.min.css\" rel=\"stylesheet\">\
 </head> \
<!-- <script src=\"./js/socket.io.js\"></script>-->\
 <script src=\"https://cdn.socket.io/4.3.2/socket.io.min.js\"></script>\
 <script src=\"https://code.jquery.com/jquery-3.4.1.min.js\"></script> \
 <script src=\"https://cdnjs.cloudflare.com/ajax/libs/jquery.terminal/2.34.0/js/jquery.terminal.min.js\"></script>\
 <script src=\""+options.url+"basic.js\"></script>\
 <script>\
   const IOproto = \""+options.proto+"\";\
   const IOip    = \""+options.publicip+"\";\
   const IOport  = \""+options.port+"\";  \
   const textTimeout = \""+options.lngTimeout+"\";\
 </script>\
 <body style=\"height: 100%;margin: 0;\">\
   <div id=\"terminal\" style=\"height:100%;\">\
   </div>\
 </body>\
 <script src=\""+options.url+"wtio.js\"></script>\
</html>";
	res.send(result);
    }
}
