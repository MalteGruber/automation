
var b=require("../common/broadcast.js")
var sys = require('sys')
var fs = require('fs');

var exec = require('child_process').exec;
b.startWithName("SpotifyAPI")
b.setOnConnectListener(function(){});
b.setOnDisonnectListener(function(){})


b.setOnReadyListener(function(){
	//b.broadcast({greeting:"Hello world"});
});
b.setOnMessageListener(function(msg){
	onMessage(msg)
})

var spotifyToken="";
try{
	
	spotifyToken = fs.readFileSync(("../../spotifyToken.txt"), 'utf8');
	spotifyToken=spotifyToken.replace("\n","");
	console.log("Found Token:",spotifyToken);

} catch(e){
	console.log(e)
	console.error("ERROR! Please specify spotify token in file outside git repo!");
}


function onMessage(msg){

	try{
	if(msg.spotify.cmd==="NEXT"){
	exec('curl -X "POST" "https://api.spotify.com/v1/me/player/next" -H "Accept: application/json" -H "Content-Length: 0" -H "Content-Type: application/json" -H "Authorization: Bearer '+spotifyToken+'" ')
	}
	if(msg.spotify.cmd==="PREV"){
	exec('curl -X "POST" "https://api.spotify.com/v1/me/player/previous" -H "Accept: application/json" -H "Content-Length: 0" -H "Content-Type: application/json" -H "Authorization: Bearer '+spotifyToken+'" ')
	}

	if(msg.spotify.cmd==="PLAY"){
		console.log("play")
	exec('curl -X "PUT" "https://api.spotify.com/v1/me/player/play" -H "Accept: application/json" -H "Content-Length: 0" -H "Content-Type: application/json" -H "Authorization: Bearer '+spotifyToken+'" ')
	}

		if(msg.spotify.cmd==="PAUSE"){
			console.log("pause")
	exec('curl -X "PUT" "https://api.spotify.com/v1/me/player/pause" -H "Accept: application/json" -H "Content-Length: 0" -H "Content-Type: application/json" -H "Authorization: Bearer '+spotifyToken+'"')
	}
	}catch(e){

}
}


