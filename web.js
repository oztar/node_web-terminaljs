'use strict'

module.exports = function(req,res){
    const j = require('./').options;
    let result = "<!DOCTYPE html> \
<html lang=\"es\"> \
 <head> \
  <meta charset=\"UTF-8\">\
  <title> Web Terminal Js  </title> \
  <link rel=\"stylesheet\" href=\"/css/terminal.css\" type=\"text/css\" /> \
 </head> \
 <script src=\"/js/jquery-3.4.1.min.js\"></script>\
 <script src=\"/js/jquery.terminal-2.29.2.min.js\"></script>\
 <script src=\"/js/socket.io.js\"></script>\
 <script src=\"/js/basic.js\"></script>\
 <script>\
   let IOproto = \""+j.proto+"\";\
   let IOip    = \""+j.publicip+"\";\
   let IOport  = \""+j.port+"\";  \
   let textTimeout = \""+j.lngTimeout+"\";\
 </script>\
 <body style=\"height: 100%;margin: 0;\">\
   <div id=\"terminal\" style=\"height:100%;\">\
   </div>\
 </body>\
 <script src=\"/js/io.js\"></script>\
 <script src=\"/js/terminal.js\"></script>\
</html>";
    res.send(result);
};
