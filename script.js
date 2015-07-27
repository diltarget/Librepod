//var events = require('./event.js');
var libs = require('./lib.js');
var xml2js = require('xml2js');
var fs = require('fs');

var dir=process.cwd()+'/scripts'; 

var parser = new xml2js.Parser();

exports.build = function(callback){

	libs.build(function(){
	//events.build(function(){
	fs.readdir(dir,function(err,files){
    		if (err) throw err;
    	var c=0;
    	files.forEach(function(file){
		if(file.indexOf(".xml") - file.length == -4)
		{

		fs.readFile(dir+'/'+file,'utf-8',function(err,html){
		
		parser.parseString(html, function (err, result) {
			if(err) return;
			Object.keys(result).forEach(function(s) {
			result = result[s]
			if(libs.exist(s,'event') == false && s != "main") return;
			
			if(s === "main"){
				exports.call(file.substring(0,file.length-4),{},function(out){
					console.log("@"+s+": "+out);
				});
			}else{
				libs.call(s,'event',result['$'], function(r){
					exports.call(file.substring(0,file.length-4),r,function(out){
						console.log("@"+s+": "+out);
					});
				});
			}
			
		});
		
		});

		});
			

		}
		else
		{
			return;
		}
        });
	callback();
	});
	});

    //});

}

exports.call = function(f,par,callback){

	fs.readFile(dir+'/'+f+'.xml','utf-8',function(err,html){
		if(err){
			console.log(err)
			return;
		}

		parser.parseString(html, function (err, result) {
			//console.log(result);
			Object.keys(result).forEach(function(s) {
				result = result[s]
				run(par,result,callback);
			});
		});
			
	});
	
}

function run(r,program,callback){
	if(typeof r === "undefined") r={};
	Object.keys(program).forEach(function(key) {
		if(key==="$"){ return;}
		if(typeof program[key] != "object") return;
  		Object.keys(program[key]).forEach(function(val){
			if(typeof program[key][val] != "object") return;
			Object.keys(program[key][val]).forEach(function(m){
				Object.keys(program[key][val][m]).forEach(function(l){
					var p = program[key][val][m][l]['$'];
					if(typeof p != "undefined"){
						Object.keys(p).forEach(function(g){
							
							if(typeof p[g] != "string") return;
						
							var list = p[g].split("{");
						
							Object.keys(list).forEach(function(k){
						   
								if(list[k].indexOf("}") > 0){
									list[k] = list[k].split("}")[0];
						        
									if(r[list[k]] != undefined){
										p[g] = p[g].replace("{"+list[k]+"}", r[list[k]]);

									}
						        
								}
							});
					    
						});
					}
					
					libs.call(key, m,p, function(out){callback(out)});
				});
			});
		});
	});

}
