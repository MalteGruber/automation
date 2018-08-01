function pingBtn(){
    websocketStringifySend({poke:true});
}
function pushLineToDiv(line){
    var para=document.createElement("p");
    var node=document.createTextNode(line);
    para.appendChild(node);
    var element=document.getElementById("heartbeatDisp");
    element.appendChild(para);
    para.style.marginBottom = "0px";
    return para;
}
function createStatusText(hb){
    return hb.heartbeat+" from "+hb.ip+" local time "+hb.time;
    for(var i=0;i<heartbeats.length;i++){
        heartbeats[i].style.color="#f00";

        
           
    }
}
var heartbeats=[];
function updateOrAddHeartbeat(hb){
    var found=false;
    /*If we have received the heartbead previously, replace it with the fresh one*/
    for(var i=0;i<heartbeats.length;i++){
        if(heartbeats[i].heartbeat===hb.heartbeat){
            /*Keep the reference to the display text*/
            var disp=heartbeats[i].disp;
            heartbeats[i]=hb;
            heartbeats[i].disp=disp;
            disp.innerHTML=(createStatusText(hb))
            disp.style.color="#00ff55";
            found=true;
            break;
        }
    }
    if(!found){
        hb.disp=pushLineToDiv(createStatusText(hb));
        heartbeats.push(hb);
    }
}
/*Receives ws messages and checks for pings*/
function pingMessageHandler(msg){
    console.log("lol",msg)
    try{
        var e=JSON.parse(msg);
        if(e.heartbeat){
            console.log("HEARTBEAT",e.heartbeat);
            updateOrAddHeartbeat(e);
        }
    }catch(e){
    }
}