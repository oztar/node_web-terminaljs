window.onkeydown=capturarf5;//capturamos f5 y deshabilitamos
function capturarf5(e){
    let code = e.keyCode;    
    if(code == 116)
    {
	e.keyCode=114;
	return false;
    }
}

class EventEmitter{
    constructor(){
        this.callbacks = {}
    }

    on(event, cb){
        if(!this.callbacks[event]) this.callbacks[event] = [];
        this.callbacks[event].push(cb)
    }
    off(event){
        delete this.callbacks[event];
    }

    emit(event, data){
        let cbs = this.callbacks[event]
        if(cbs){
            cbs.forEach(cb => cb(data))
        }
    }
}

var ee = new EventEmitter();

let pushid = (id,dato)=>{
    if( id == 'blocktwo' || id == 'terminal'){
	ee.emit('ee|end');//quitamos el gestor de eventos
    }
    document.getElementById(id).innerHTML = dato;
}




function getid(id){return document.getElementById(id).innerHTML;}
function addid(id,dato){document.getElementById(id).innerHTML = getid(id)+dato;}
function preid(id,dato){document.getElementById(id).innerHTML = dato+getid(id);}
function pushclass(id,clase){document.getElementById(id).className = clase;}




function startTimers() {
    if( timers_sokect_block == 0){
	timers_sokect_block = setTimeout( ()=>{
	    alerta({
		title: 'Time Out',
		text:  'Lo sentimos, la web est&aacute; tardando mucho',
		action: '',
		acept_title : '',
		action_dats : '',
		bclose: true
	    });
	    ubloq();
	},10000);
    }
}

function stopTimers(){
    if( timers_sokect_block ){
        clearTimeout(timers_sokect_block);
        timers_sokect_block = 0;
    }
}
