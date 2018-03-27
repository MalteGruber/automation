var WebSocketClient = require('websocket').client;
var timer=require("./timer")

function getUTC(){
	return parseInt(new Date().getTime()/1000);
}

/*Application logic*/
function onMessage(msg){
	if(msg.poke){
		sendHeartbeat();
	}
}




function isJsonString(str) {
	try {
		JSON.parse(str);
	} catch (e) {
		return false;
	}
	return true;
}

var ip = require("ip");


function sendHeartbeat(){
		var datetime = new Date().toJSON().slice(0,10) 
    + " " + new Date(new Date()).toString().split(' ')[4];
	if(connection)
		connection.sendUTF("Timer modlue active ip="+ip.address()+" @ "+datetime);
	console.log("heartbeat")
}
function startHeartBeats(){
	setInterval(function(){
	sendHeartbeat();
}, 50*1000)

}

/*Websocket stuff*/
var fs = require('fs');
var path="websocketIp.txt";
var serverAddress="ws://youraddresshere.cow:9001";
var connection=null;

try{
	serverAddress = fs.readFileSync(path, 'utf8');
} catch(e){
	console.error("ERROR! Please specify an IP address in a text file at "+path);
	console.error("The file should contain an address in the following format:");
	console.error("ws://123.321.123.321:9400");
	console.error("OBS! Do not add a new line character at the end of the address!");
}

var client = new WebSocketClient();

client.on('connectFailed', function(error) {
	onOffline();
	console.log('Connect Error: ' + error.toString());
});

client.on('connect', function(c) {
	connection=c;
	timer.setConnection(c);
	//testTimer();
	console.log('Timer client connected');


	connection.on('error', function(error) {
		onOffline();
		console.log("Connection Error: " + error.toString());
	});

	connection.on('close', function() {
		onOffline();
		console.log('Connection Closed');
	});

	connection.on('message', function(message) {
		if (message.type === 'utf8') {
        //    console.log("Received: '" + message.utf8Data + "'");
        if(isJsonString(message.utf8Data)){
        	var data=JSON.parse(message.utf8Data);
        	onMessage(data);
        	timer.onMessage(data);
        }else{
        	//console.log("nonJSON: "+message.utf8Data);
        }
    }
});

});



function testTimer(){

	/*Absolute time*/
	timer.onMessage({timecmd:{cmd:"SET",time:getUTC()+5,action:[{triggeredbyTimer:5}]}});
	timer.onMessage({timecmd:{cmd:"SET",time:getUTC()+7,action:[{triggeredbyTimer:7}]}});
	timer.onMessage({timecmd:{cmd:"SET",time:getUTC()+10,action:[{triggeredbyTimer:10}]}});
	timer.onMessage({timecmd:{cmd:"LIST"}});
	timer.onMessage({timecmd:{cmd:"DELETE",eventId:2}});
	timer.onMessage({timecmd:{cmd:"LIST"}});

	timer.onMessage({timecmd:{cmd:"PURGE"}});
	/*Relative time*/
	timer.onMessage({timecmd:{cmd:"SET",in:8,action:[{triggeredbyTimer:8}]}});

}

function init(){
	console.log("Connecting to server "+serverAddress)
	
	startHeartBeats();
	client.connect(serverAddress);	
}

/*Uncomment if you dont want the program to execute the server*/
init();

