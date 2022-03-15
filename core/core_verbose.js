'use strict'
let ee = require('../').ee;
let j  = require('../').options;
let u  = require('../').u;


ee.on('LOG',function(level){
    j.io.to('LOG'+level).emit('result:command',u(arguments[1]));
});

