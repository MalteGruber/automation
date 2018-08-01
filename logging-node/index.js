
var b=require("../common/broadcast.js")
b.startWithName("Logging node")
b.setOnConnectListener(function(){});
b.setOnDisonnectListener(function(){})


b.setOnReadyListener(function(){
	//b.broadcast({greeting:"Hello world"});
});
b.setOnMessageListener(function(msg){
	onMessage(msg)
})



const fs = require('fs');
var messageFrequency=0;


/*Safety feature*/
setInterval(()=>{
	if(messageFrequency>0){
		messageFrequency-=1;
	}
},10000);

var MAX_FREQ=40; //400 seconds timeout

function onMessage(msg){

	try{
		if(msg.log){
			var logMessage=msg.log;
			messageFrequency++;

			if(messageFrequency<MAX_FREQ){
				fs.appendFileSync('log.txt', JSON.stringify(logMessage)+"\n");
			}else{
				broadcast({errorMsg:"To many log messages!!!"});
			}
		}
	}catch(e){
		console.log(e)
	}
}

