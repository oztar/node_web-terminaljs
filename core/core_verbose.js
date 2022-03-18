'use strict'

const u  = require('util').format;

module.exports = function(level){
    this.options.io.to('LOG'+level).emit('result:command',u(arguments[1]));
}
 
