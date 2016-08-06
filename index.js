var express		= require('express');
var mysql		= require('mysql');
var iotdb		= mysql.createPool({
					host     : 'localhost',
					user     : 'pi',
					password : 'mypi',
					database : 'iot'
				});

var pug = require('pug');
var app = express();
var node = [];
var nodeadmin = require('nodeadmin');
var morgan = require('morgan');
var expressLess = require('express-less');
var bodyParser = require('body-parser');
var mqtt    = require('mqtt');
var client  = mqtt.connect({host:'localhost', port:1883});

app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

app.use(morgan('dev'));
app.use(nodeadmin(app));
app.set('view engine', 'pug');
app.use('/less-css', expressLess(__dirname + '/less', { debug: true }));
app.use(express.static(__dirname + '/public'));
app.locals.pretty = true;

app.get('/', function (req, res) {
	res.render('index', { title: 'IoT Automation', message: 'System online!'});
});

client.on('connect', function () {
  client.subscribe('#');
  //client.publish('presence', 'Hello mqtt');
});
 
client.on('message', function (_topic, _message) {
	var topic = _topic.toString();
	var message = _message.toString();
	var topics = topic.split("/");
	var nodename = topics[1];
	var query;
	var sql = []; // empty array for sql objects

	if (message.indexOf("=")) {
		data = message.split("=");
		payload = data[1];
		topic = topics[0]+'/'+topics[1]+'/'+data[0];
		topics[2] = data[0];
	} else return;

	if (topics[2]!="cmd") { // update last seen timestamp
		query = "INSERT INTO nodes (nodename,topic,payload,lastseen) "
					+"VALUES (\'"+ nodename +"\',\'"+ topic +"\',\'"+ payload +"\',CURRENT_TIMESTAMP) "
					+"ON DUPLICATE KEY UPDATE "
					+"topic=\'"+ topic +"\',"
					+"payload=\'"+ payload +"\',"
					+"lastseen=CURRENT_TIMESTAMP";
		sql.push(query); // add query to sql array
	}

	if ((topics[2]==="temperature") || (topics[2]==="temp")) { // log temps
		query  = "INSERT INTO temps (topic,temp) VALUES (\'"+ nodename +"\',\'"+ payload +"\')";
		sql.push(query); // add query to sql array
						
		query  = "INSERT INTO current_temps (nodename,temperature) "
					+"VALUES (\'"+ nodename +"\',\'"+ payload +"\') "
					+"ON DUPLICATE KEY UPDATE temperature=\'"+ payload +"\'";    
		sql.push(query); // add query to sql array
	} 

	if ((topics[2]==="vcc") || (topics[2]==="bat")) { // log battery voltages
		query = "INSERT INTO vbat (topic,battery) "
					+"VALUES (\'"+ nodename +"\',\'"+ payload +"\') "
					+"ON DUPLICATE KEY UPDATE battery=\'"+ payload +"\'";    
		sql.push(query); // add query to sql array

		query = "INSERT INTO vbat_history (nodename,battery) VALUES (\'"+ nodename +"\',\'"+ payload +"\');";
		sql.push(query); // add query to sql array
	}

	if (topics[2]==="rssi") { // log signal strength
		query = "INSERT INTO rssi (nodename,rssi) "
					+"VALUES (\'"+ nodename +"\',\'"+ payload +"\') "
					+"ON DUPLICATE KEY UPDATE "
					+"rssi=\'"+ payload +"\'";
		sql.push(query); // add query to sql array
		query = "INSERT INTO rssi_history (nodename,rssi) VALUES (\'"+ nodename +"\',\'"+ payload +"\');";
		sql.push(query); // add query to sql array
	} 

	if (topics[2]==="amps0" || topics[2]==="amps1" || topics[2]==="amps2" || topics[2]==="amps3") { // log signal strength
		query = "INSERT INTO amps (nodename,sensor,value) "
					+"VALUES (\'"+ nodename +"\',\'"+ topics[2] +"\',\'"+ payload +"\') ";
		sql.push(query); // add query to sql array
	} 

  	iotdb.getConnection(function(err, connection){ // grab db connection from pool
		sql.forEach(function(sql,index) { // loop through any sql generated above
			connection.query(sql, function(err,rows) {
				if (err) throw err; // log any errors
			});
		});
		connection.release(); // release db connection
	});
});

app.get('/nodecontrol', function (req, res) {
	var ipAddr = req.query.ip;
	var macAddr = req.query.mac;
	if (ipAddr===undefined) ipAddr = "192.168.2.134";
	res.render('nodecontrol', { deviceip: ipAddr, mac: macAddr });
});

app.get('/nodelist', function (req, res) {
	var get = req.query.get;
	if (get=="json") { // send JSON data to page for live updates
		iotdb.getConnection(function(err, connection){
			var sqlQuery = "select DATE_FORMAT(lastseen,'%b %d %Y %H:%i') as 'lastseen', "
							+"mac,nodename,currentip,cfgversion,fwversion,fwpath,flashmb as 'flash' "
							+"from nodelist "
							+"order by nodename;";
			connection.query(sqlQuery, function(err, rows, fields) {
				if ((!err) && (rows.length>0)) res.send(rows)
			});
			connection.release();
		});
	} else { // send inital page itself
		//console.log(JSON.stringify(fields));
		res.render('nodelist');
	}
});

app.get('/nodedetails', function (req, res) {
	var macAddr = req.query.mac;
	var reqdata = req.query.reqdata;
	var sql = {};

	sql[0] = {	name: "Nodelist",
				desc: "Node Configuration Detail",
				ro: 0,
				sql: "select DATE_FORMAT(lastseen,'%b %d %Y %H:%i') as 'lastseen', \
						mac,nodename,currentip,cfgversion,fwversion,fwpath,flashmb as 'flash' \
						from nodelist \
						order by nodename"
			};

	sql[1] = {	name: "Summary",
				desc: "Summary of Active Nodes",
				ro: 1,
				sql: "select DATE_FORMAT(rssi.ts,'%b %d %Y %H:%i') as 'ts', \
						rssi.nodename, rssi.rssi, vbat.battery, current_temps.temperature \
						from rssi, vbat, current_temps \
						where rssi.nodename = vbat.topic and \
						rssi.nodename = current_temps.nodename \
						order by rssi.ts desc"
			};

	sql[2] = {	name: "Temperatures",
				desc: "Node Temperature Data",
				ro: 1,
				sql:  "select topic, min(temp*1.0) as 'min',round(avg(temp*1.0),2) as 'avg', max(temp*1.0) as 'max', \
				count(topic) as 'samples' from temps group by topic order by count(topic) desc"
			};

	sql[3] = {	name: "Voltages",
				desc: "Node Voltage Data",
				ro: 1,
				sql:  "select nodename, min(battery*1.0) as 'min',round(avg(battery*1.0),2) as 'avg', max(battery*1.0) as 'max', \
				count(nodename) as 'samples' from vbat_history group by nodename order by count(nodename) desc"
			};

	sql[4] = {	name: "Amperage",
				desc: "Node Amperage Data",
				ro: 1,
				sql:  "select nodename,sensor,min(value) as 'min',max(value) as 'max' from amps group by nodename,sensor"
			};


	console.log("reqdata=" +reqdata);

	if (reqdata!=undefined) { // send data to ajax call
		iotdb.getConnection(function(err, connection){
			var sqlQuery = sql[reqdata].sql;
			connection.query(sqlQuery, function(err, rows, fields) {
				if ((!err) && (rows.length>0)) res.send(rows)
			});	
			connection.release();
		});
	} else { // send inital page
		res.render('nodedetails',{tabs: sql});	
	}
});


app.post('/nodeupdate', function (req, res) {
	var macAddr = req.body.mac;
	var configKey = req.body.key;
	var configValue = req.body.val;
	iotdb.getConnection(function(err, connection){
		var sqlUpdate = "SELECT 1";
		if (macAddr!=undefined) sqlUpdate = 'UPDATE nodelist SET cfgversion=cfgversion+1,' +configKey+ '=\'' +configValue+ '\' WHERE mac=\'' +macAddr+ '\'';
		console.log(sqlUpdate);
		connection.query(sqlUpdate, function(err, rows, fields) {
			if (err) res.send(err);
			else res.send("Update OK");
		});
		connection.release();
	});
});

app.get('/iotconfig', function (req, res) {
	iotdb.getConnection(function(err, connection){
		var macAddr = req.query.mac;
		var nodeName = req.query.nodename;
		var fullConfig = req.query.full;
		var readConfig = req.query.readconfig;

		var sqlQuery;
		var remIp = req.ip;
		remIp = remIp.substr(7);
		//console.log('check-in from mac ' +macAddr);
		//console.log('remote ip ' +remIp);
		var where = "WHERE mac like \'" +macAddr+ "\'";
		if (macAddr===undefined) where = "WHERE nodename like \'" +nodeName+ "\'";

		if (fullConfig=="yes")  sqlQuery = 'SELECT * FROM nodelist ' +where;
		else sqlQuery = 'SELECT mac,nodename,mqttserver,mqttport,altadcvbat,'
								+'mqttpub,mqttsub,mqttbase,sleepenable,sleepperiod,'
								+'cfgversion,fwversion,usegetvcc,vccdivsor,vccoffset,'
								+'hastout,hastpwr,hasiout,hasi2cpwr,rawadc,ntpoffset,'
								+'hasspeed,hasi2c,iotsda,iotscl,hasvout,hasrssi,updaterate,'
								+'sw1en,sw2en,sw3en,sw4en,sw1pin,sw2pin,sw3pin,sw4pin,'
								+'sw1label,sw2label,sw3label,sw4label,acsoffset,'
								+'sw1type,sw2type,sw3type,sw4type,hasrgb '
								+'FROM nodelist ' +where;

		var sqlUpdate = "SELECT 1";
		if ((readConfig==undefined) && (macAddr!=undefined)) {
			sqlUpdate = 'UPDATE nodelist SET lastseen=CURRENT_TIMESTAMP,currentip=\'' +remIp+ '\' WHERE mac like \'' +macAddr+ '\'';
			console.log("Recording check in from " +remIp);
		} else {
			console.log("Not recording query from " +remIp);
		}
		connection.query(sqlQuery, function(err, rows, fields) {
			if ((!err) && (rows.length>0)) {
				macAddr=rows[0].mac;
				if (readConfig==undefined) console.log(rows[0].nodename+ ' (' +macAddr+') checking in, cfgversion=' +rows[0].cfgversion);
				res.status(200).send(JSON.stringify(rows[0]));
				connection.query(sqlUpdate, function(err, result) {});
			} else { // node not in database, add it!
				if ((readConfig==undefined) && (macAddr!=undefined)) {
					var sqlInsert = 'INSERT INTO nodelist (mac,nodename,currentip,lastseen) '+
								'VALUES (\'' +macAddr+ '\',\'esp-' +macAddr.substr(6)+ '\',\'' +remIp+ '\',CURRENT_TIMESTAMP)';
					connection.query(sqlInsert, function(err, result) {});
					console.log('added mac ' +macAddr+ ' to db as nodename esp-' +macAddr.substr(6));
				}
				res.status(404).send('No config found\n');

			}

		});
		connection.release();
	});
});



app.get('/iotfw', function (req, res) {
	iotdb.getConnection(function(err, connection){
		var macAddr = req.query.mac;
		var nodefw = parseInt(req.get('x-ESP8266-version'));
		var chipSize = parseInt(req.get('x-ESP8266-chip-size'));
		var flashSize;
		if (chipSize<4000000) flashSize=1;
		else flashSize=4;
		
		var options = {
			dotfiles: 'deny',
			headers: {
				'x-timestamp': Date.now(),
				'x-sent': true
			}
		};

		var sqlQuery = 'SELECT mac,nodename,fwversion,fwpath FROM nodelist WHERE mac like \'' +macAddr+ '\'';
		var sqlUpdate = 'UPDATE nodelist SET lastseen=CURRENT_TIMESTAMP,flashmb=' +flashSize+ ' WHERE mac like \'' +macAddr+ '\'';
		connection.query(sqlQuery, function(err, rows, fields) {
			if ((!err) && (rows.length>0)) {
				var latestfw = parseInt(rows[0].fwversion);
				var nodename = rows[0].nodename;
				console.log(nodename+ " flash capacity " +flashSize+ "m, running fw " +nodefw+ " latest " +latestfw);
				connection.query(sqlUpdate, function(err, result) {});
				if (nodefw < latestfw) {
					console.log(nodename+ ' updating firmware');
					console.log(" ");
					var fileName = rows[0].fwpath;
					
					res.sendFile(fileName, options, function (err) {
						if (err) {
							console.log(err);
							res.status(err.status).end();
						} else console.log(nodename+ ' downloaded ', fileName);
					});
				} else {
					res.status(304).send('No new firmware for mac ' +macAddr+ '\n');
					console.log(nodename+ ' no new firmware');
					console.log(" ");
				}
			}
		});
		connection.release();
	});	

});

app.listen(3000, function () {
  console.log('IoT automation listening on port 3000!');
});