## web-terminaljs  Version 0.0.2
Its a system for web terminal, control your nodejs by  using jquery terminal
create modules for your code: 
 - restart nodejs 
 - control memory

## autor notes
This version is the base code, it is totally improvable.
The project has particulars: jquery.min inside the project.
I keep working to make it more professional. I hope you like it.

## Install

   npm install web-terminaljs 

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
    path     : path by your custom modules or addons wtm
    verbose  : Level inital console

## Core comands

   - mem       : alias memory
   - memory    : info memory process using
   - save      : Send event save modules loaded [trues and falses]
   - restart   : Restart process nodejs
   - verbose   : Level indicated your verbose terminal [0,9]
   - help      : List all comands modules loaded
   - echo      : Echo module
   - module    : < options >
	 * load   : Load new module in path
	 * unload : Unload module in path
	 * reload : Unload and load module in path
	 * show   : List all modules in memory
	 * list   : List all modules Load and Unload in path

## save

Its a core function but not working alone.
you need crear a event listen ee.on(save:config)

    const ee = require('web-terminaljs').ee;
    ee.on('save:config', function(json_list){

        ...
	/*
	json_list{
	 module_name1 : true,
	 module_name2 : false,
	 ...
	}
	*/
	your code here
	...
    });


## module custom
you can create new modules, you will can use wtm_default template to create custom

- you cant install:

 customNameModule.js in **options.path** default **/modules** folder
 /modules/customNameModule.js

- structure for new comannd: 

		module.exports = {
		command : {
			'name' : {
				description : 'description module',
				usage : 'howto use command',
				auto  : ['argument']
			}
		},
		name : function()...
		autoload : false
		}

 - structure for new module without command:

   		module.exports = {
			command : {},
			load : function()...
			unload : function()...
			autoload : true
		}

