'use strict'
const ee = require('web-terminaljs').ee;
const f  = require('web-terminaljs').functions;

const load = function(socketID){
    this.login =  this._login;
}
const unload = function(socketID){}

module.exports = {
    command : {},
    load,
    unload,
    autoload : true
}
