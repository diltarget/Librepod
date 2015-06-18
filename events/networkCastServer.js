var net = require('net');

module.exports = {
    event: function(o,callback){
        if(o.port == undefined) return;
        
        var server = net.createServer(function(socket) {
	        socket.on('data',function(data){
	            callback(JSON.parse(data);
	        }
        });
 
        server.listen(parseInt(o.port), '127.0.0.1');
        
    }
}
