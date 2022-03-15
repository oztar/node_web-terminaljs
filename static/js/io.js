const socket = io(IOproto+'://'+IOip+':'+IOport+'/terminal');
let form = [];
let json_table = {};
let debug = 0;


socket.on('respuesta', (res)=>{  
    console.log(res);
    ubloq();
});			 

let send_socket = (data)=>{
    socket.emit({event_name: 'send:socket',data : data});
}

function change_x(id){
    document.getElementById(id).className = 'class_x';
}
