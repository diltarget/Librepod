//deviceManager.js

var lib = require('..//lib.js');

module.exports = {
    checkDead: function(i,callback){
        if(i == undefined || i.store == undefined || i.timeout == undefined) return;
        var stamp = Math.floor(Date.now() / 1000);
        
        lib.call("datastore","getStore",i,function(out){
            console.log(out);
            lib.call("log","getStore",i,function(log){
                console.log(log);
                var mLog = JSON.parse(log);
                var dead = []
                Object.keys(mLog).forEach(function(k){
                   console.log(mLog[k]);
                   if (parseInt(mLog[k][0]) + parseInt(i.timeout) < stamp && out[mLog[k][2]] != undefined){
                      console.log(mLog[k][0]);
                      dead.push(mLog[k][2]);
                   }
                });
                    
                callback(JSON.stringify(dead));
                
            });
        });
    }
}

