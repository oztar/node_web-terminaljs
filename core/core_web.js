'use strict'
let options;

module.exports = {
    star_web : function(){	
	if( this.options.express === undefined){throw new Error('web Terminaljs need express() or similar | use command npm install express');}
	if( this.options.app === undefined){throw new Error('web Terminaljs need express() or similar');}
	if( this.options.io  === undefined){throw new Error('web Terminaljs need lib socket.io| use command npm installsocket.io');}
	options = {
	    proto      : this.options.proto,
	    publicip   : this.options.publicip,
	    port       : this.options.port,
	    lngTimeout : this.options.lngTimeout
	};

	this.options.app.use(this.options.url, this.options.express.static(__dirname +'/../static/'));	
	this.options.app.use(this.options.url, this._html);

    },
    html : function(req,res){
	const result = "<!DOCTYPE html> \
<html lang=\"es\"> \
 <head> \
  <meta charset=\"UTF-8\">\
  <title> Web Terminal Js  </title> \
  <link rel=\"stylesheet\" href=\"./css/terminal.css\" type=\"text/css\" /> \
 </head> \
 <script src=\"./js/jquery-3.4.1.min.js\"></script>\
 <script src=\"./js/jquery.terminal-2.29.2.min.js\"></script>\
 <script src=\"./js/socket.io.js\"></script>\
 <script src=\"./js/basic.js\"></script>\
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
 <script src=\"./js/io.js\"></script>\
 <script src=\"./js/terminal.js\"></script>\
</html>";
	res.send(result);
    }
}
