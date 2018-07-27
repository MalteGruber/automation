
var settings=require("../../configAutomation.js");
var SpotifyWebApi = require('spotify-web-api-node');



function step1_getCode(argument) {
	/*What we want access to*/
	var scopes = ['user-modify-playback-state', 'user-read-currently-playing','user-read-playback-state']
	var spotifyApi = new SpotifyWebApi({
		redirectUri: settings.credentials.redirectUri,
		clientId: settings.credentials.clientId
	});
	var authorizeURL = spotifyApi.createAuthorizeURL(scopes);
	console.log("ACCESS IN BROWSER AND PASTE CODE IN STEP II")
	console.log(authorizeURL);
}


function stepTwo_get_refresh_Token(){


//See https://developer.spotify.com/documentation/general/guides/authorization-guide/
//
//
//Basically the steps are: 
//Get code using url generated in step 1, select what permissions you want to use!
//Add code from response redirect of url to this:
var codeFromPrevStep="AQ.....js"
//Run the resulting curl command
//Extract the refresh token from the response
//Add resfresh token to your configAutomation.js
//Done! :)

//Authorization: Basic: Base 64 encoded string that contains the client ID and client secret key. The field must have the format: Authorization: Basic *<base64 encoded client_id:client_secret>*
var concat=settings.credentials.clientId+":"+settings.credentials.clientSecret;
var basicAuth=new Buffer(concat).toString('base64')


var curl='curl -H "Authorization: Basic '+basicAuth+'" -d grant_type=authorization_code -d code='+codeFromPrevStep+' -d redirect_uri='+settings.credentials.redirectUri+' https://accounts.spotify.com/api/token'
console.log(curl)
}

//OBS: Run once, or the code gets bad
//step1_getCode();
console.log("STEP 2 ---------------------------------")
stepTwo_get_refresh_Token();

