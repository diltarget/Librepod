#! /usr/bin/env node
var parm = process.argv;
console.log(parm.length);
if(parm.length == 2 || parm[2] === "webapi"){
	require('./webapi.js');
}else if(parm[2] === "init"){
	
	delete parm[0];
	delete parm[1];
	delete parm[2];
	
	require('./init.js')['init'](parm);
}
