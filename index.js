'use strict'
/**
 * @file Web-Terminaljs
 * @author Alfredo Roman <alfredoromandominguez@gmail.com>
 * @version 0.5.0
*/



const EventEmitter = require('events').EventEmitter;

const core = require('./core');

class terminal extends EventEmitter{
    /* default config */
    module = {};//funstions for module
    list_modules = {};//list of modules load
    user = {};//list socket IO connected 
    f    = core.functions;//functions
    client_socket = {};//list client io object
    repo = {};//list modules repositorie
    installed = {};//list modules installed in custom path
    options = {
	webEngine     : true,
	proto         : 'http',
	publicip      : '127.0.0.1',
	port          : 80,
	path          : __dirname+'/../../modules/',
	url           : '/',
	io_name_space : 'terminal',
	lngTimeout    : 'comand not found',
	verbose       : 0,
	login         : false, 
	app           : '',//express()
	io            : '',//sokect.io(http.createServer(app))
	list_command       : {},//list enabled commands
	list_usage_command : {},//autocomplete list v1
	list_auto_command  : {},//autocomplete list v1
	modules            : {},//list modules loaded
	user               : {}//list user login
    };

    //functions core
    _opc           = core.options;
    _load_module   = core.mods.load_module;
    _unload_module = core.mods.unload_module;
    _start_modules = core.mods.start_modules;
    _log           = core.verbose;
    _welcome       = core.welcome;
    _start_web     = core.web.star_web
    _html          = core.web.html;
    _basic         = core.web.basic;
    _wtio          = core.web.io;
    _io            = core.io;


    //functions external, default-> always true
    _login(dats){
	this.emit(dats.id+'login|true');
    }

    constructor(options){
	super();
	this._opc(options);
	this._start_modules();
	if( this.options.webEngine){
	    this._start_web();
	}
	this._io();

    }
}



module.exports =terminal;
