var fs = require('fs');

exports.init = function(param){
	var dir=process.cwd()

	fs.mkdir(process.cwd()+'/libs', function(err){
		if(err) return;
	});

	fs.mkdir(process.cwd()+'/config', function(err){
		if(err) return;
	});

	fs.mkdir(process.cwd()+'/scripts', function(err){
		if(err) return;
	});

	var out = ""
	
	Object.keys(param).forEach(function(k){
		out += param[k]+"\n";
	});
	
	fs.writeFile(dir+'/libs/GLOBAL_LIBS',out);
}
