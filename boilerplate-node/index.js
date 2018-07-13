
var b=require("../common/broadcast.js")
b.startWithName("Change Me!")
b.setOnConnectListener(function(){});
b.setOnDisonnectListener(function(){})


b.setOnReadyListener(function(){
	//b.broadcast({greeting:"Hello world"});
});
b.setOnMessageListener(function(msg){
	onMessage(msg)
})


function onMessage(msg){

	if(msg.dimAddr&&msg.val!==null){
	}
}

