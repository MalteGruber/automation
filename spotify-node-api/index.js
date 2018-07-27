
var b=require("../common/broadcast.js")
var settings=require("../../configAutomation.js");
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


var SpotifyWebApi = require('spotify-web-api-node');
var spotifyApi = new SpotifyWebApi();

spotifyApi.setCredentials({
  refreshToken: settings.credentials.refreshToken,
  redirectUri: settings.credentials.redirectUri,
  clientId: settings.credentials.clientId,
  clientSecret: settings.credentials.clientSecret
});


function getUTC(){
  return parseInt(new Date().getTime()/1000);
}

var lastUpdate=0;
refreshAccessToken();

function autoRefreshAccessToken(){
  var now=getUTC();
  if((now-lastUpdate)>3000){
    console.log("Last update ",now-lastUpdate,"seconds ago, updating now!")
    refreshAccessToken();
    lastUpdate=now;
  }else{
    console.log("Last update ",now-lastUpdate,"seconds ago, still valid!")
  }
}

function refreshAccessToken(){

  spotifyApi.refreshAccessToken().then(
    function(data) {
      console.log('The access token has been refreshed!',data.body['access_token']);

    // Save the access token so that it's used in future calls
    spotifyApi.setAccessToken(data.body['access_token']);



    //console.log('The access token is ' , spotifyApi.getAccessToken());
  },
  function(err) {
    console.log('Could not refresh access token', err);
  }
  );
}




function onMessage(msg){

	try{
    if(msg.spotify.cmd){
      autoRefreshAccessToken();
    }


    if(msg.spotify.cmd==="NEXT"){

      spotifyApi.skipToNext()
      .then(function(data) {
        console.log('Artist information', data.body);
        sendSongInfo();
      }, function(err) {
        console.error(err);
      });

    }
    if(msg.spotify.cmd==="PREV"){

      spotifyApi.skipToPrevious()
      .then(function(data) {
        console.log('Artist information', data.body);
        sendSongInfo();
      }, function(err) {
        console.error(err);
      });

    }

    if(msg.spotify.cmd==="PLAY"){
     console.log("play")
     spotifyApi.play()
     .then(function(data) {
      console.log('Artist information', data.body);
      sendSongInfo();

    }, function(err) {
      console.error(err);
    });

   }

   if(msg.spotify.cmd==="PAUSE"){
     console.log("pause")
     spotifyApi.pause()
     .then(function(data) {
      console.log('Artist information', data.body);
    }, function(err) {
      console.error(err);
    });

   }
   if(msg.spotify.cmd==="SONG"){
     sendSongInfo();

   }


 }catch(e){

 }
}


function sendSongInfo(){
	var delay=500;
	setTimeout(()=>{
   spotifyApi.getMyCurrentPlaybackState({
   })
   .then(function(data) {
    // Output items
    //console.log("Now Playing: \n\n",JSON.stringify(data.body),"\n\n");

    console.log("playing:",data.body.item.artists[0].name)
    b.broadcast({spotify:{playing:data.body.item.name+" by "+getArtistString(data.body.item.artists)}})
  }, function(err) {
    console.log('Something went wrong!', err);
  });
 },delay)
}
function getArtistString(e){
	var artists="";
	for(var i=0;i<e.length;i++){
		if(i>0){
			artists+=" and ";
		}
		artists+=e[i].name;

	}
	return artists;
}


