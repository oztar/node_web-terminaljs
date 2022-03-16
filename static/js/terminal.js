let terminal_command_timeout = 0;
let terminal_command_date = 0;
let terminal_time_timeout = 10;//seconds 
let terminal_autocomplete = {};
jQuery(function($, undefined) {
    let terminal = $('#terminal').terminal(function(command) {
        if (command !== '') {
            try {
		if( terminalUnblockTimeout() == 1){
		     socket.emit('terminal:command',command);
		}else{
		    e = '('+getTimeLeft(terminal_command_timeout)+'s unblocked)';
		    this.error(new String('System Blocked '+e));
		}
            } catch(e) {		
		terminalUnblockInTime();
                this.error(new String(e));
            }
        } else { 
	    this.error(new String('empty command using help'));
        }
    }, {
	autocompleteMenu: true,	
	completion: completions,
        greetings: '',
        name: 'Web Terminal JS',
        height: '100%',
        prompt: 'wt> '
    });


    function error(err){
	terminalUnblockInTime();
	terminal.error(new String(err));
    }

    socket.on('result:command', (result)=>{
	terminalUnblockInTime();
	if (result !== undefined) {
	    terminal.echo(new String(result));
	}
    });

    socket.on('result:error',error);
    ee.on('result:error', error);

    socket.emit('welcome','welcome');

    socket.on('update:command',(ncom,args)=>{
	terminal_autocomplete[ncom] = args;//v1
    });
    socket.on('delete:command', (dcom)=>{
	delete terminal_autocomplete[dcom];
    });
});

function completions(command, options){
    try{  
	let comand = this.get_command().split(' ');
	if( comand.length <= 2){
	   // completions2(comand,this);
	    completionsv2(comand,this,1,comand[0]);
	}else if(comand.length >= 3){
	    let search = '';
	    for( let i =0; i<=(comand.length-2);i++){
		search +=comand[i]+' ';
	    }
	    completionsv2(comand,this,(comand.length-1),search.substring(0, search.length-1));
	}

    }catch(e){
	console.log(e);
    }
    
}
function completionsv2(comand,thes,pos,search){
    let list = [];
    let regex;
    try{  
	if( comand[pos] !== undefined && comand[pos].length == 0){
	    thes.echo( new String(terminal_autocomplete[search].join('\t')));
	}else if( comand[pos] !== undefined){
	    regex = new RegExp('^' +comand[pos]);
	    for( let id in terminal_autocomplete[search]){
		let name = terminal_autocomplete[search][id];
		if( regex.exec(name) != null){
		    list.push(name);
		}
	    }
	    if( list.length == 1){
		thes.set_command(search+' '+list[0]);
	    }else{
		thes.echo( new String(list.join('\t')));
	    }
	}else if(terminal_autocomplete[search] !== undefined){
	    thes.echo( new String(terminal_autocomplete[search].join('\t')));
	}else {
	    regex = new RegExp('^' +comand+'[^ ]+$');
	    for( let name in terminal_autocomplete){
		if( regex.exec(name) != null){
		    list.push(name);
		}
	    }
	    if( list.length == 1){
		thes.set_command(list[0]);
	    }else{
		thes.echo( new String(list.join('\t')));
	    }
	}
    }catch(e){
	console.log(e);
    }
}

function getTimeLeft() {   
    return Math.ceil(( (terminal_time_timeout*1000+terminal_command_date) - Date.now() ) / 1000);
}

function terminalUnblockTimeout(){
    if( terminal_command_timeout != 0){
	return 0;
    }else{
	terminal_command_date = Date.now();
	terminal_command_timeout = setTimeout( ()=>{
	    ee.emit('result:error','Command: Error TimeOut');
	},terminal_time_timeout*1000);
	return 1;
    }
}
function terminalUnblockInTime(){
    if( terminal_command_timeout){
	clearTimeout(terminal_command_timeout);
	terminal_command_timeout =0;
	terminal_command_date = 0;
    }
}
