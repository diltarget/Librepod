var net = require('net');

var conn = [];

module.exports = {
    send: function(i,callback){
        if(i == undefined) return;
        
        Object.keys(conn[o.id]).forEach(function(k){
            conn[o.id][k].write(JSON.strinify(i));
        });
    
    },event: function(o,callback){
        
        if(typeof conn === "object"){
            addEvent(o.id)
            return;
        }
            
        if(o.port == undefined) return;
        
        var server = net.createServer(function(socket) {
            
	        socket.on('data',function(data){
	            callback(JSON.parse(data));
	        });
	        
	        conn.push(socket);
	        
        });
 
        server.listen(parseInt(o.port), '127.0.0.1');
        
    }
}

function addEvent(id){
    Object.keys(conn).forEach(function(k){
        conn[k].on('data',function(data){
            callback(JSON.parse(data));
        });
    });
}
