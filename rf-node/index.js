
var b=require("../common/broadcast.js")
b.startWithName("433 Mhz receiver")
b.setOnConnectListener(function(){});
b.setOnDisonnectListener(function(){})
b.setOnReadyListener(function(){});





/*Serial port is not trivial to install, read the docs! ;/
https://www.npmjs.com/package/serialport
*/

var SerialPort = require('serialport');
var port = new SerialPort('/dev/ttyACM0',{
	baudRate: 115200
});



var rBuffer="";


port.on('data', function (data) {

	var str=data.toString('utf8');

	for (var i = 0; i < str.length; i++) {

		var c=str.charAt(i);
		if(c=="\n"){
			console.log("Received line: ",rBuffer)
			onUartLine(rBuffer);
			rBuffer="";
			
		}else{
			rBuffer+=c;
		}

	}

});



var mutedVals=[];



function muteValFor(val, time){
	mutedVals.push(val);
	setTimeout(function(){
	//	console.log("CLEARING",val)
		var index = mutedVals.indexOf(val);
		//Remove value
		if (index > -1) {
			
			mutedVals.splice(index, 1);
		}


	},time);
}

function onUartLine(msg){
	try{
		msg=JSON.parse(msg);
	//	console.log("JSON uart received: ",msg)
	console.log(msg.val)


	/*Cotech has some random stuff in the middle, hence we cut it out*/
	if(msg.proto===1){
		//1111 0000 0000 0000 0000 1111
		//http://www.instructables.com/id/Control-CoTech-Remote-Switch-With-Arduino-433Mhz/
		msg.val=msg.val&0xf0000f
	}

	if(mutedVals.indexOf(msg.val)>-1){
		console.log("ignoring",mutedVals)
	}else{



		switch(msg.val){


			/*Keyfob six buttons*/

			case 1500080554:
			muteValFor(msg.val,600);
			b.broadcast({buttonClick:"nexaFob_a1"});
			break;
			case 1500080810:
			muteValFor(msg.val,600);
			b.broadcast({buttonClick:"nexaFob_a0"});		
			break;			
			case 1500080553:
			b.broadcast({buttonClick:"nexaFob_b1"});		
			break;			
			case 1500080809:
			b.broadcast({buttonClick:"nexaFob_b0"});		
			break;			
			case 1500080550:
			b.broadcast({buttonClick:"nexaFob_c1"});		
			break;			
			case 1500080806:
			b.broadcast({buttonClick:"nexaFob_c0"});		
			break;	

			case 1500079786:
			b.broadcast({buttonClick:"nexaFob_all_off"});		
			break;			


			/*Wall button dual*/
			case 1716873573:
			b.broadcast({buttonClick:"nexaWall_a1"});
			break;
			case 1716873829:
			b.broadcast({buttonClick:"nexaWall_a0"});		
			break;			
			case 1716873574:
			b.broadcast({buttonClick:"nexaWall_b1"});		
			break;			
			case 1716873830:
			b.broadcast({buttonClick:"nexaWall_b0"});		
			break;			


			/*Wall button single*/
			case 1432709478:
			b.broadcast({buttonClick:"nexaWall_c1"});
			break;
			case 1432709734:
			b.broadcast({buttonClick:"nexaWall_c0"});		
			break;			


			/*Motion sensor
			
			Since the device sends multiple bursts, we want to make it deaf
			after the first burst that we receive.

			*/


			case 14680078: //Trigger
				muteValFor(msg.val,2000);
				b.broadcast({buttonClick:"motionsensor_1"});	
				break;
			case 5242894: //No movement
				muteValFor(msg.val,2000);
			b.broadcast({buttonClick:"motionsensor_0"});		
			break;			
			default:
			console.log("NOT RECOGNIZED!! ",msg.val)
			break;



		}
	}

}catch(e){
	console.error(e)
}


}

b.setOnMessageListener(function(msg){
	
});


console.log("OBS Read the serialport docs on how to install!");