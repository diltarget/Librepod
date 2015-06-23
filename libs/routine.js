var script = require('..//script.js')
var lib = require('..//lib.js')

module.exports={
	call: function(i,callback)
	{
		if(typeof i.call === "undefined"){
			callback("");
			return;
		}
		
		var par = i;
		
		var returnpar = {}
		var sub = {}
		
		Object.keys(par).forEach(function(k){
	    
		    if(par[k].indexOf("(") == 1 && par[k].indexOf(")") == par[k].length-1){
		        
		        if(i[k].substring(0,1) === "!"){
		            returnpar[k] = par[k].replace("!(","").replace(")","");
		            par[k] = undefined;
		        }else if(i[k].substring(0,1) === "$"){
		            returnpar[k] = par[k].replace("$(","").replace(")","");
		            par[k] = par[k].replace("$(","").replace(")","");
		        }
		        
		        
		    }else if(par[k].indexOf("(") == 0 && i[k].indexOf(")") == i[k].length-1){
		        sub[k] = par[k].replace("(","").replace(")","");
		        par[k] = undefined;
		    }
		});
		            
        if(par.return == undefined){
		    controlFlow(par.call,par,callback);
		}
		else{
		    controlFlow(par.call, i, function(o){
		        var p = {};
		        if(typeof o === "object"){
		            p=o;
		        }else if(o != undefined){
		            p.val=o
		        }else{
		            p={}
		        }

		        Object.keys(returnpar).forEach(function(l){
		            p[l]=returnpar[l];
		        });
		        
		        Object.keys(sub).forEach(function(m){
		            p[m] = p[sub[m]];
		        });
		        
		        controlFlow(par.return,p,callback);
		 
		    });
		}

	},
	compare: function(i,callback){
        if(i["exp1"] == undefined || i["exp2"] == undefined) return;
        
        var parm = {}
        
        Object.keys(i).forEach(function(k){
            if(k === "exp1" || k === "exp2" || k === "equal" || k === "greater" || k === "less") return;
            parm[k] = i[k];
        });
        
        if(i["exp1"] === i["exp2"] && i.equal != undefined){
            controlFlow(i.equal,parm, callback);
            callback("equal");
        }
        else if(parseFloat(i["exp1"]) == parseFloat(i["exp2"]) && i.equal != undefined){
            controlFlow(i.equal,parm,callback);
            callback("equal");
        }else if(parseFloat(i["exp1"]) > parseFloat(i["exp2"]) && i.greater != undefined){
            controlFlow(i.greater,parm,callback);
            callback("greater");
        }else if(parseFloat(i["exp1"]) < parseFloat(i["exp2"]) && i.less != undefined){
            controlFlow(i.less,parm,callback);
            callback("less");
        }
    },
    
	
};

function controlFlow(expression,parm, callback){
    if(expression.indexOf("[") == 0 && expression.indexOf("]") == expression.length-1){
        var e = expression.split(" ");
        lib.call(e[0].replace("[",""),e[e.length-1].replace("]",""),parm, callback);
        
    }else{
        script.call(expression,parm,callback);
    }
}
        
        
