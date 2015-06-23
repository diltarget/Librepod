var net = require('net');

var conn;

module.exports = {
    send: function(i,callback){
        if(conn == undefined) return;
        
        try{
            conn.write(JSON.stringify(i));
        }catch(e){
            console.log(e);
        }
    },
    event : function(i,callback){
        if(i.ip == undefined || i.port == undefined) return;
        
        client = new net.Socket();
        client.connect(parseInt(i.port), i.ip, function() {
            conn = client;
        });
        
        client.on('data',function(data){
            callback(data);
        });
        
    }
}
    
        
        
        
        
