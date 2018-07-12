
var b=require("../common/broadcast.js")
b.startWithName("NeXa Sender")
b.setOnConnectListener(function(){});
b.setOnDisonnectListener(function(){})


b.setOnReadyListener(function(){
	//b.broadcast({greeting:"Hello world"});
});
b.setOnMessageListener(function(msg){
	onMessage(msg)
})


function onMessage(msg){
		/*Nexa messages*/
	if(msg.addr&&msg.state!==null){
		console.log("Nexa message received!");
		sendCommand("nexa-driver/main",[msg.addr,msg.state]);
	}	

	if(msg.dimAddr&&msg.val!==null){
		console.log("Nexa dim message received!");
		sendCommand("nexa-driver/main",[msg.dimAddr,16-msg.val,"dimmer"]);
	}
}


function sendCommand(cmd,argv){
	'use strict';

	const
	spawn = require( 'child_process' ).spawnSync,
	ls = spawn( cmd, argv);

//	console.log( `stderr: ${ls.stderr.toString()}` );
//	console.log( `stdout: ${ls.stdout.toString()}` );
}

/*Send some commands when booting*/
var backupSequence=[
{ "addr": 4, "state": 1 },
{ "dimAddr": 2, "val": 0 },
{ "addr": 3, "state": 1 },
];

setTimeout(()=>{
for(var i=0;i<backupSequence.length;i++){
	onMessage(backupSequence[i]);
}
},1000);