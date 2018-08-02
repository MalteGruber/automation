function pingBtn(){
    websocketStringifySend({poke:true});
}

/*The nodes will return send heartheats when the website connects and when the user
 * sends a ping request. Hence we want to keep a record of which nodes that have
 * responded. If we ping again, the node should be updated with the timestamp or
 *  in case of failure, a fault indication.
 * 
 * 
 * 
 * 
 *  */

/*
function pushLineToDiv(line){
    var para=document.createElement("p");
    var node=document.createTextNode(line);
    para.appendChild(node);
    var element=document.getElementById("heartbeatDisp");
    element.appendChild(para);
    para.style.marginBottom = "0px";
    return para;
}
*/

function getStatusId(id){
    return "#status_"+id;
}
function addDisplay(id, hb){
    createDisplayEntrie(id,createStatusText(hb))
}
function updateExsistingDisplay(id, hb){
    $("#statusText"+id).html(createStatusText(hb))
}

function createStatusText(hb){
    return hb.heartbeat+" from "+hb.ip+" local time "+hb.time;
    for(var i=0;i<heartbeats.length;i++){
        heartbeats[i].style.color="#f00";
    }
}
function restartFadeout(id){    
                // $("#statusText"+id).fadeOut("slow");
}

var heartbeats=[];
function updateOrAddHeartbeat(hb){
    var found=false;
    /*If we have received the heartbead previously, replace it with the fresh one*/
    for(var i=0;i<heartbeats.length;i++){
        if(heartbeats[i].heartbeat===hb.heartbeat){
            heartbeats[i].alive=true;
            updateExsistingDisplay(i,hb);
            restartFadeout(i);
            found=true;
            break;
        }
    }
    if(!found){
        /*heartbeats length is the same as id after push*/
        addDisplay(heartbeats.length,hb.heartbeat)
        restartFadeout(heartbeats.length);
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


function createDisplayEntrie(idNo,text){
    var template=$("#pingTemplate").html();
    var tmp=template;
    var nodeNameId=""+idNo
    var statusTextId="statusText"+nodeNameId;
    console.log(idNo);
    tmp=tmp.replace("STATUS_TEXT",text)           
    tmp=tmp.replace("NODE_ID",nodeNameId)
    tmp=tmp.replace("NODE_ID",nodeNameId)
    tmp=tmp.replace("STATUS_ID",statusTextId)
    $("#"+statusTextId).html(statusTextId)
    tmp=tmp.replace("hidden","")
    $("#seedForPingStatus").html($("#seedForPingStatus").html()+tmp)
}


function onMuteEnable(argument) {

   websocket.send(JSON.stringify(({mute:true,who:heartbeats[argument].heartbeat})));
}
       function onMuteDisable(argument) {

         
   websocket.send(JSON.stringify(({unmute:true,who:heartbeats[argument].heartbeat})));
    // body...
}
