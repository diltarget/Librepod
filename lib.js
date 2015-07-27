//Dylan Thomas 2015
//GNUPLV2

var fs = require('fs');
var xml2js = require('xml2js');
var exec = require('child_process').exec;
var config = require('./config');

var data={};
var dir=process.cwd()+'/libs';

var parser = new xml2js.Parser();

exports.build = function(callback){

	fs.readdir(dir,function(err,files){
    		if (err) throw err;
    	files.forEach(function(file){
		if(file.indexOf(".xml") - file.length == -4)
		{
        	
        	fs.readFile(dir+'/'+file,'utf-8',function(err,html){
            	if (err) throw err;
		parser.parseString(html, function (err, result) {
			Object.keys(result).forEach(function(key) {
  				data[key]=result[key];
  				console.log(key);
			});
		});
		});
		}
		else if(file.indexOf(".js") - file.length == -3)
		{
        	
  				data[file.substring(0,file.length-3)]=require(dir+'/'+file);
  				console.log(file.substring(0,file.length-3));

		
		}
		else if(file === "GLOBAL_LIBS")
		{
        	
  			fs.readFile(dir+'/GLOBAL_LIBS','utf-8',function(err,html){
				console.log(html)
				if (err) return;
				var list = html.split("\n")
				Object.keys(list).forEach(function(k){
					fs.readdir(process.env['HOME']+'/LibrepodLibs/'+list[k],function(err,filelist){
						filelist.forEach(function(f){
							if(f.indexOf(".xml") - f.length == -4)
							{
								fs.readFile(process.env['HOME']+'/LibrepodLibs/'+list[k]+'/'+f,'utf-8',function(err,html){
									if (err) return;
									parser.parseString(html, function (err, result) {
										Object.keys(result).forEach(function(key) {
											data[key]=result[key];
											console.log(key);
										});
									});
								});
							}
							else if(f.indexOf(".js") - f.length == -3)
							{   	
								data[f.substring(0,f.length-3)]=require(process.env['HOME']+'/LibrepodLibs/'+list[k]+'/'+f);
								console.log(f.substring(0,f.length-3));	
							}
						});
					});
				});
			});
		}
		});

	console.log(data);

    config.build(callback);

    });

}

exports.call = function(object,func, param, callback){

	if(data[object]===undefined) return false;
	if(data[object][func]===undefined) return false;	

	if(typeof data[object][func] === "function")
	{

		data[object][func](param,callback);
		return;

	}

	var command="";

	if(typeof data[object][func][0] != "string"){
		command=data[object][func][0]['_'];

		Object.keys(data[object][func][0]['$']).forEach(function(key){
			if(data[object][func][0]['$'][key]==="var")
			{
				command = command.replace(new RegExp("{"+key+"}","g"), param[key]);
			}
			else if(data[object][func][0]['$'][key]==="config")
			{
				command = command.replace(new RegExp("{"+key+"}","g"), config.get(object,param[key]));
			}
			else if(data[object][func][0]['$'][key]==="all")
			{
				command = command.replace(new RegExp("{"+key+"}","g"), "{all}");
			}
			else if(data[object][func][0]['$'][key]==="name")
			{
				command = command.replace(new RegExp("{"+key+"}","g"), "{name}");
			}
		});
	}
	else{
		command=data[object][func][0];
	}


	if(command.indexOf("{all}")<0){
		
		exec(command, function (error, stdout, stderr) {
		
			callback(stdout);
			
		});
	}
	else
	{
		var list = config.list(object);
		Object.keys(list).forEach(function(key){
			var ctemp=command.replace(new RegExp("{all}","g"),list[key]);
			ctemp=ctemp.replace(new RegExp("{name}","g"),key);
			exec(ctemp, function (error, stdout, stderr) {
				//console.log(stdout);
				callback(stdout);

			});
		});

	}

}

exports.exist = function(o,f){
	if(data[o] == undefined) return false;
	if(data[o][f] == undefined) return false;
	
	return true;
}
