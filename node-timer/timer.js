


var broadcast=null;

exports.setBroadcastCallback = function (c) {
	broadcast=c;
}


var events=[];



exports.onMessage = function (msg) {
	console.log("timer got ",msg)
	if(msg.timecmd){
		switch(msg.timecmd.cmd){
			case "SET":
				console.log("SET command received")
				if(msg.timecmd.time){
					events.push({time:msg.timecmd.time,action:msg.timecmd.action});
				}else if(msg.timecmd.in){
					var trigTime=getUTC()+msg.timecmd.in;
					events.push({time:trigTime,action:msg.timecmd.action});
				}
			break;

			case "LIST":
				broadcast(events);
			break;
			case "DELETE":
				console.log("deleting event",msg.timecmd.eventId)
				events.splice(msg.timecmd.eventId,1);
			break;
			case "PURGE":
				console.log("Purged events...")
				events=[];
			break;			
		}
	}

};

function getUTC(){
	return parseInt(new Date().getTime()/1000);
}
function sendCommands(action){
	for (var i = 0; i < action.length; i++) {
		broadcast(action[i]);
	}
}

function tick(){
	var now=getUTC();
	for (var i = events.length - 1; i >= 0; i--) {
		if(events[i].time<now){
			console.log("Triggered, executing command")
			sendCommands(events[i].action)
			
			/*Remove that element (we are checking 
			length each itteration, so should be ok)*/
			events.splice(i,1);
			console.log("Removed handeled event, events=",events)
		}
	}
}
setInterval(tick,500);