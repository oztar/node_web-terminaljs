## web-terminaljs  Version 0.0.1
Its a system for web terminal, control your nodejs by  using jquery terminal
create modules for your code: 
 - restart nodejs 
 - control memory

## Install

npm install web-terminaljs

## explample basic 

{

// using librarys express,http and socket.io	

 const wt = require('web-terminaljs').terminaljs;

 const options = { 

    port : 80

 };

 const app     = express();

 app.listen();

 const IOserver  = http.createServer(app);

 const io = libIO(IOserver);

 wt(options,express,app,io);

 IOserver.listen(options.port);

}

## explample other path 	

{

 //path /private/terminal/

 // using librarys express,http and socket.io	

 const wt = require('web-terminaljs').terminaljs;

 const options = { 

    port : 80

 };

 const app     = express();

 app.listen();

 const IOserver  = http.createServer(app);

 const io = libIO(IOserver);

 wt(options,express,app,io,'/private/terminal/');

 IOserver.listen(options.port);

}
