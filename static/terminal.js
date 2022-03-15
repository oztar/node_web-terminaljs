'use strict'
let render = require('../../services').render;
let j      = require('../../services').config;

module.exports = (route)=>{

route.get('/interface/terminal', function(req,res){    
    render('html/index', {
	proto      : j.mem.web.proto,
	port       : j.config.web.port,
	public_ip  : j.config.serverInfo.publicIp,
	version    : process.env.npm_package_version,
	txtTimeout : j.mem.lng[ j.config.serverInfo.languaje ].webTimeout
    }).then( (result)=>{
	res.send(result);
    });
});


return route;

}
