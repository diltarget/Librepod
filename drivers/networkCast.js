var net = require('net');

var conn = {}

module.exports = {
    send: function(i,callback){
        if(i.id === undefined) return;
        i.id = undefined;
        conn[i.id].write(JSON.stringify(i));
    },
    new : function(i,callback){
        if(i.ip === undefined || i.port === undefined || i.id === undefined) return;
        
        var client = new net.Socket();
        client.connect(parseInt(i.port), i.ip, function() {
            conn[i.id] = client;
            callback(i.ip+":"+i.port+" Success");
        });
    }
}
    
        
        
        
        
