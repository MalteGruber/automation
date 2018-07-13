
var b=require("../common/broadcast.js")
var fs = require("fs");
var equal = require('deep-equal');

b.startWithName("Macro Handler")
b.setOnConnectListener(function(){});
b.setOnDisonnectListener(function(){})


b.setOnReadyListener(function(){
	//b.broadcast({greeting:"Hello world"});
});

b.setOnMessageListener(function(msg){
	onMessage(msg)
})


/*Macros are stored in a primitive json file*/


function saveJson(json){
	fs.writeFile( "personalMacros.json", JSON.stringify( json ), "utf8");
}
function openJson(){
	return (require("./personalMacros.json"));
}


var isRecordingMacro=false;
var isRecordingMacroTrigger=false;
var macroTrigger={};
var macro=[];


var macroStorage=openJson();

function addOrUpdateMacro(){
	var exists=false;
	for(var i=0;i<macroStorage.length;i++){
		if(equal(macroStorage[i].trigger,macroTrigger)){
			var exists=true;
			macroStorage[i].macro=macro;
			console.log("Macro updated!");
			break;
		
		}

	}
	if(!exists){
		macroStorage.push({trigger:macroTrigger,macro:macro});
		console.log("New macro created!");
	}
	saveJson(macroStorage)
}

function sendMacros(macros){
	for(var i=0;i<macros.length;i++){
		b.broadcast(macros[i]);
	}
}

function notGarbage(msg){
	try{
		if(msg.heartbeat){
			return false;
		}
		if(msg.macro){
			return false;
		}
	}catch(e){

	}
	return true;
}
function onMessage(msg){


	try{
		if(msg.macro.cmd==="STOP"){
			console.log("Stopping!")
			isRecordingMacro=false;
			isRecordingMacroTrigger=false;
		}
		if(msg.macro.cmd==="RECORD"){
			macro=[];
			isRecordingMacro=false;
			isRecordingMacroTrigger=true;
			console.log("Recording!")
		}	
		if(msg.macro.cmd==="COMMIT"){
			isRecordingMacro=false;
			isRecordingMacroTrigger=false;
			console.log("Committing!")
			addOrUpdateMacro();
		}
		if(msg.macro.cmd==="FLUSH"){
			console.log("Flushing!")
			macro=[];

		}
		if(msg.macro.cmd==="STATUS"){
			console.log("TRIGGER:",macroTrigger);
			console.log("MACRO:",macro)
		}
	}catch(e){console.log(e)}

	if(notGarbage(msg)){
		console.log("Not garbage",msg)


		if(isRecordingMacro){
			macro.push(msg);
			console.log("Added command",msg);			
		}else if(isRecordingMacroTrigger){
			macroTrigger=msg;
			console.log("Macro trigger set to",macroTrigger)
			isRecordingMacroTrigger=false;
			isRecordingMacro=true;
		}else{
			/*Send macro if trigger*/
			for(var i=0;i<macroStorage.length;i++){
				if(equal(macroStorage[i].trigger,msg)){
					console.log("Found trigger!!!",msg)
					sendMacros(macroStorage[i].macro);
				}
			}

		}





	}




}

