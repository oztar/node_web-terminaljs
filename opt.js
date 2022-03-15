'use strict'



module.exports = function(options){
    const j = require('./').options;
    if( options === undefined){ return;}
    j.proto = options.proto || j.proto;
    j.publicip = options.publicip || j.publicip;
    j.port = options.port || j.port;
    j.lngTimeout = options.lngTimeout || j.lngTimeout;
    return;
};
