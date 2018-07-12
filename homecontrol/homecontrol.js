

function sliderClick(e,addr,max){
    var bounds=e.target.getBoundingClientRect();
    var val=e.offsetX/bounds.width;
    var resolution=max;
    var output=parseInt(val*resolution)
    websocketStringifySend({dimAddr:addr,val:output});
}

function onSwitchButtonPress(state,addr){
    websocketStringifySend({addr:addr,state:state})
}

function getOnCommands(){
    var ret=[];
    for(var i=0;i<switchButtons.length;i++){
        if(switchButtons[i].max)//Is dimmer
            ret.push({dimAddr:switchButtons[i].dimAddr,val:15});
        else
            ret.push({addr:switchButtons[i].addr,state:1});
    }
    return ret;
}

//Hacked in addiditions TODO Make this a bit nicer..
function setAllOn(){

	try{
		Android.dim(0.5);
	}catch(e){
		//alert("Not android")
	}
    var cmds=getOnCommands();
    for(var i=0;i<cmds.length;i++){
        websocketStringifySend(cmds[i])
    }
}

//Hacked in addiditions TODO Make this a bit nicer..
function setAllOff(){
	try{
		Android.dim(0.02);
	}catch(e){
		//alert("Not android")
	}
    for(var i=0;i<switchButtons.length;i++){
        websocketStringifySend({addr:switchButtons[i].addr,state:0});
    }
}

/*This function generates code for a on/off button pair, the button 
 * will call onSwitchButtonPress() when pressed with the arg {state=0,addr=4}*/
function registerButton(html,name,addr){
    html=html.replace("TITLE",name);
    html=html.replace(/ADDR/g,addr);
    return html;
}

var switchButtons=[
    //         {addr: 2, name: "Desk lamp 1"},
    {addr:2,name:"Desk lamp",max:16,dimAddr:2},
    {addr:4,name:"Desk lamp LED"},
    {addr:3,name:"Monitor power"},
    {addr:5,name:"Nightstand"},
    {addr:6,name:"Fan"},
]

var xhr=new XMLHttpRequest();
xhr.open('GET','button.html',true);
xhr.onreadystatechange=function(){
    if(this.readyState!==4)
        return;
    if(this.status!==200)
        return; // or whatever error handling you want
    //document.getElementById('y').innerHTML= this.responseText;
    
    var html="";
    for(var i=0;i<switchButtons.length;i++){
        html+=registerButton(this.responseText,switchButtons[i].name,switchButtons[i].addr)
        if(switchButtons[i].max){
            var str="   <button type=\"button\" onclick=\"sliderClick(event,ADDRDIM,MAX);\" class=\"btn btn-default btn-block dimmer-scale\">Brightness<\/button>\r\n";
            str=str.replace("ADDRDIM",switchButtons[i].dimAddr);
            str=str.replace("MAX",switchButtons[i].max);
            html+=str;
        }
    }
    document.getElementById('buttons').innerHTML=html;
};
xhr.send();

//Timer-----------------
var timeToSet=5;
function setTimerText(){
    $("#timerText").text("In "+timeToSet+" hours")
}
setTimeout(function(){
    setTimerText();
},100);
function incTimer(){
    timeToSet++;
    setTimerText();
}
function decTimer(){
    timeToSet--;
    setTimerText();
}

function commitTimer(){
    var action=getOnCommands();

    var cmd={timecmd:{cmd:"SET",in:timeToSet*3600,action:action}};
    websocketStringifySend(cmd);

    var cmd={timecmd:{cmd:"SET",in:timeToSet*3600+4,action:action}};
    websocketStringifySend(cmd);

    var cmd={timecmd:{cmd:"SET",in:timeToSet*3600+8,action:action}};
    websocketStringifySend(cmd);
}

function purgeTimers(){
    websocketStringifySend({timecmd:{cmd:"PURGE"}});
}
function listTimers(){
    websocketStringifySend({timecmd:{cmd:"LIST"}});
}

