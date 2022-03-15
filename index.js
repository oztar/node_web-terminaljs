'use strict'
const EE = require('events');
const u  = require('util').format;

/* event emiter */
class ME extends EE {}
const ee = new ME();
ee.setMaxListeners(50);
/* fichero de config */


//require('./core');
const _iot    = require('./ioTerminal');
const _html   = require('./web');
const _opt    = require('./opt');

const options = {
    proto : 'http',
    publicip : '127.0.0.1',
    port  : 80,
    path : '/modules',
    lngTimeout : 'comand not found',
    list_command : {},//list enabled commands
    list_usage_command : {},//autocomplete list v1
    list_auto_command : {},//autocomplete list v1
    ioc : {},//list io clients	
    modules : {},//list modules loaded
    module : {}//funstions module 
};

module.exports = {
    options,
    u,
    ee,
    terminaljs: function(options,express,app,io,path = '/'){
	_opt(options);

	if( express === undefined){throw new Error('web Terminaljs need express() or similar');}
	if( app === undefined){throw new Error('web Terminaljs need express() or similar');}
	if( io  === undefined){throw new Error('web Terminaljs need lib socket.io');}
	app.use(path, express.static(__dirname +'/static/'));
	app.use(path, _html);
	
	io = _iot(io);//start socket io
    }
}

require('./core');
