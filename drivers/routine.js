var script = require('..//script.js')
var driver = require('..//driver.js')

module.exports={
	call: function(i,callback)
	{
		if(typeof i.routine === "undefined"){
			callback("");
			return;
		}
		
        
        if(i.object == undefined && i.call == undefined){
		    script.call(i.routine,i,callback);
		}
		else if(i.object != undefined && i.call != undefined){
		    driver.param(i.object,i.call,i,function(o){
		        if(typeof o === "object"){
		            script.call(i.routine,o,callback);
		        }else if(o != undefined){
		            script.call(i.routine,{val:o},callback);
		        }
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
            script.call(i.equal,parm, callback);
            callback("equal");
        }
        else if(parseFloat(i["exp1"]) == parseFloat(i["exp2"]) && i.equal != undefined){
            script.call(i.equal,parm,callback);
            callback("equal");
        }else if(parseFloat(i["exp1"]) > parseFloat(i["exp2"]) && i.greater != undefined){
            script.call(i.greater,parm,callback);
            callback("greater");
        }else if(parseFloat(i["exp1"]) < parseFloat(i["exp2"]) && i.less != undefined){
            script.call(i.less,parm,callback);
            callback("less");
        }
    },
    
	
};
