//Mark Goldberg & Dylan Thomas
var dblite = require('dblite');
var db = dblite('libs/localdata');

module.exports={
	set: function(i,callback)
	{
		if(i.tag == undefined || i.store == undefined) return;
		console.log("stuff");
		dbPush(i);
		callback(JSON.stringify(i)+" logged to "+i.tag);
	},
	get: function(i,callback)
	{

		if(i.tag == undefined || i.store == undefined) return;
		
		if(i.limit == undefined)
		{
			dbQuery(i.store,i.tag,1, callback);
		}
		else
		{
			dbQuery(i.store,i.tag, i.limit, callback);
		}	
			
	},
	getStore: function(i,callback)
	{

		if(i.store == undefined) return;
		
		dbQueryStore(i.store, callback);
			
	},
	delete: function(i, callback)
	{
		if(parseInt(i.since) == NaN) return;
		
		db.query("DELETE FROM localdata WHERE time <= @s", {s:i.since});
		
		callback("success");
	}

};

function dbPush(data)
{
	var o = {};

	Object.keys(data).forEach(function(key) {
		if(key != "tag" && key != "store")
		{
			o[key] = data[key];
		}
		
	});
	 
	var b = JSON.stringify(o);

	var stamp = ""+Math.floor(Date.now() / 1000);
	db.query("INSERT INTO localdata VALUES ( @s , @sto, @t , @data )", {s:stamp, t: data.tag, sto: data.store, data:b});
	
	//stmt.finalize();

	return "success";

}

function dbQuery(store,tag,limit, callback)
{

	db.query("SELECT * FROM localdata WHERE store = @store tag = @tag ORDER BY time DESC LIMIT @limit",{tag: tag, store:store, limit: limit},
  		function (err, rows) {
			console.log(typeof rows);
			if(rows == null)
			{
				callback(JSON.stringify({}));
				return;
				
			}
			for(var i = 0; i < rows.length; i++)
			{
				rows[i][0] = parseInt(rows[i][0]);
    				rows[i][2] = JSON.parse(rows[i][3]);
  			}
			callback(JSON.stringify(rows));
		}
	);
}

function dbQueryStore(store, callback)
{

	db.query("SELECT * FROM localdata t WHERE store = @store AND time = (select max(time) FROM localdata WHERE store = @sto AND t.tag=localdata.tag)",{store:store,sto:store},
  		function (err, rows) {
			console.log(rows);
			if(rows == null)
			{
				callback(JSON.stringify({}));
				return;
				
			}
			for(var i = 0; i < rows.length; i++)
			{
				rows[i][0] = parseInt(rows[i][0]);
    				rows[i][2] = JSON.parse(rows[i][3]);
  			}
			callback(JSON.stringify(rows));
		}
	);
}
