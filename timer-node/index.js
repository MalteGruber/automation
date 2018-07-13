
var b=require("../common/broadcast.js")
var timer=require("./timer")

function getUTC(){
	return parseInt(new Date().getTime()/1000);
}

/*Application logic*/
/*
function onMessage(msg){
	if(msg.poke){
		sendHeartbeat();
	}
}
*/


b.startWithName("Timer")
b.setOnConnectListener(function(){});
b.setOnDisonnectListener(function(){})
b.setOnReadyListener(function(){
	//b.broadcast({hej:"HEELOO :D "});
});
b.setOnMessageListener(function(msg){
    timer.onMessage(msg);
})

timer.setBroadcastCallback(function(m){
	b.broadcast(m)
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
