'use strict'

const vars = ['proto','publicip','port','lngTimeout','verbose'];


module.exports = function(options){
    const j = require('./').options;
    if( options === undefined){ return;}

    for( let i in vars){
	const name = vars[i];
	j[name] = options[name] || j[name];
    }
    return;
};
