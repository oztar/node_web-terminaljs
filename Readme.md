## web-terminaljs  Version 0.0.1
Its a system for web terminal, control your nodejs by  using jquery terminal
create modules for your code: 
 - restart nodejs 
 - control memory

## Install

   npm install web-terminaljs ( no yet, using manual install)

## install manual 
  
    cd /node_modules
    git clone https://github.com/oztar/node_web-terminaljs.git

## explample basic 
  
    // using librarys express,http and socket.io	
    const wt = require('web-terminaljs').terminaljs;
    
    const options = 
     port : 80
    }
    
    //your service WEB
    const app     = express();
    app.listen();
    
    //your service socket io
    const IOserver  = http.createServer(app);
    const io = libIO(IOserver);
    
    //initialice web Terminal
    wt(options,express,app,io,'/private/terminal/');
    
    //web server listening
    IOserver.listen(options.port);

## explample other path 	

    //path /private/terminal/    
    ...
    
    //initialice web Terminal
    wt(options,express,app,io,'/private/terminal/');
    
    //web server listening
    IOserver.listen(options.port);

## options 

    //options
    proto    : [http|https]
    publicip : [localhost|127.0.0.1|yourdomain.com...]
    port     : [80|443|8080...]
    path     : path by your modules or addons wtm
   