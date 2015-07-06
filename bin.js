#! /usr/bin/env node
var lib = require("./lib")
var script = require("./script")

var parm = process.argv;
var port = 8000;

for(var i = 2; i < parm.length; i++){
    if(parm[i] === "-p"){
        port = parm[i+1]
        i++
        continue;
    }
}

lib.build(function(){
    script.build(function(){});

    var server = http.createServer(function (request, response) {
        var queryData = url.parse(request.url, true).query;
        response.writeHead(200, {"Content-Type": "text/plain"});
   
    	if(queryData.object != null)
	    {
			

	    	if(queryData.call == "new")
	    	{
	    		lib.new(queryData[key],function(out){response.end(out)});
	    	}
	    	else if(queryData.call == undefined)
	    	{
	    		lib.call(queryData.object, "call", o, function(out){response.end(out)});
	    	}
	    	else
	    	{
	    		var o = {};
    
	    		Object.keys(queryData).forEach(function(key) {
	    			if(key != "type" && key != "object" && key != "call")
	    			{
	    				o[key] = queryData[key];
	    			}
	    		});
 
	    
	    		lib.call(queryData.object, queryData.call, o, function(out){response.end(out);console.log("Client: "+out);});
	    	}
		

	    }
	    else if (queryData.ping)
	    {
	    	response.end('pong');
	    }
	    else {
            response.end("Provide Valid Parameters");
  	    }
    });


    server.listen(port);

});
