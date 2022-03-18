## web-terminaljs  Version 0.2.4
It is a system for web terminal, control your nodes using jquery terminal
create modules for your code:
    - restart only code of each module - not nodejs
    - control memory
    - create your custom modules
    - delete modules

## autor notes
This version is the base code, it is totally improvable.
The project has particulars: jquery.min inside the project.
I keep working to make it more professional. I hope you like it.

I agree to add new features and improvements to the code.
Sorry if my code is not correct.

## Install

   npm install web-terminaljs 

## explample basic 
  
    // using librarys express,http and socket.io	
    const wt = require('web-terminaljs');
    
    //your service WEB
    const app     = express();
    app.listen();
    
    //your service socket io
    const IOserver  = http.createServer(app);
    const io = libIO(IOserver);

    
    const options = 
     port : 80,
     express,
     app,
     io,
     url : '/mi/private/path/uri/',
     login: true,
     modules : {
     	     "wtm_loginCrypto" : true
     }
    }
    
    //initialice web Terminal
    cont webTerminal = new wt(options);
    
    //web server listening
    IOserver.listen(options.port);

## explample other path 	

    //path /    
    ...
        const options = 
     port : 80,
     express,
     app,
     io,
     url : '/',
     login: true,
     modules : {
     	     "wtm_loginCrypto" : true
     }
    }
    ...


## options 

    //options
    express  :  Library express or compatible
    http     :  Library HTTP or compatible
    io       :  Library Socket.io

    login    : [true|false]
    proto    : [http|https]
    publicip : [localhost|127.0.0.1|yourdomain.com...]
    port     : [80|443|8080...]
    path     : path by your custom modules or addons wtm
    url      : path your uri terminal
    verbose  : Level inital console
    modules  : json { name_custonmodule : true, name_othercuston : false,... }
    users    : For Login true, list Json USERs permit using terminal 

## Core comands 

   - mem       : alias memory
   - memory    : info memory process using
   - save      : Send event save modules loaded [trues and falses]
   - restart   : Restart process nodejs
   - poweroff  : Shutdown nodejs
   - verbose   : Level indicated your verbose terminal [0,9]
   - help      : List all comands modules loaded
   - echo      : Echo module
   - install   : < options >
	 * module   : Install modules in your nodejs, in path custom modules
	 * update   : Update list oficial modules
	 * remove   : Unistall custom modules
	 * search   : Filter of list modules
   - module    : < options >
	 * load   : Load new module in path
	 * unload : Unload module in path
	 * reload : Unload and load module in path
	 * show   : List all modules in memory and commands - description
	 * list   : List all modules Load and Unload in path

## save

Its a core function but not working alone.
you need crear a event listen ee.on(save:config)

    wt.on('save:config', function(json_list){
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
			'example' : {
				description : 'description module',
				usage : 'howto use command',
				auto  : ['argument']
			}
		},
		example : function()...
		autoload : false
		}
		
  !Important:  "example" - its a same name for command and function. 

 - structure for new module without command:

   		module.exports = {
			command : {},
			load : function()...
			unload : function()...
			autoload : true
		}

  !Important: load and unload functions its mandatory with autoload = true