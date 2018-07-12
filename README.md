# Summary
This system is based on web-socket supported broadcasting. This allows for real-time communication of internet-connected units without the need of exposing ports. The system uses *nodes* that all connect to one central web-socket server. Nodes include programs running on virtual private servers, local units such as raspberry PIs or as a website on smartphones or computers.

The system can be controlled with a web-page that can be seen here:
[https://maltegruber.github.io/automation/homecontrol/](https://maltegruber.github.io/automation/homecontrol/)

## Nodes
The following nodes exist in the broadcast network.
### 433 MHz Transmitter Node 
A unit running on an always-on raspberry PI. It has a 433.92 MHz transmitter for controlling Nexa wall plugs.

### Timer Module Node
VPS Based module that can be programmed to send commands at a specific time.

## Common files 
Files shared betewen all nodes are stored in the `/common/` folder.
### broadcast.js
The `broadcast.js` file contains code for connecting to the websocket server. Boilerplate looks as follows
```

var b=require("../common/broadcast.js")
b.startWithName("Some client name")
b.setOnConnectListener(function(){});
b.setOnDisonnectListener(function(){})
b.setOnReadyListener(function(){
	b.broadcast({greeting:"Hello world"});
});
b.setOnMessageListener(function(msg){
	console.log("GOT MESSAGE",msg);
})
``` 

## Server Configuration

A start scripts is executed from `/etc/rc.local` which has the following addition: `su - mg -c /home/mg/onboot.sh`.

The script `onboot.sh` contains the following code for launching screens
```
date >> boottimes.txt
screen -dm -S codepondServer nodejs /home/mg/codepond/index.js
screen -dm -S timerNode nodejs /home/mg/automation/node-timer/index.js

```

When a node starts it will look for an address to connect to. This address should be stored in a file named `~/websocket_address.ip `. The program will look in the home directory of the user that launched the program. This is done from the common `broadcast.js` file and is the same for all programs!

## npm install in the common folder!
