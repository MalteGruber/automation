           
           function getCookie(cname) {
    var name = cname + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    for(var i = 0; i <ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}
           var webSocket=null;
             function connect(){
                //----------------------------------------

                url=getCookie("wsIp")
                console.log("cookie ip address",getCookie("wsIp"));

                webSocket = new WebSocket(url);
                webSocket.onopen = function (evt) {          
                    webSocket.send('{"poke":true}');
                };

                webSocket.onmessage = function (evt) {
                    pingMessageHandler(evt.data);
                    //pushLog("received: "+evt.data);
                    onWsMessage(evt.data)
                    //console.log(evt.data)
                    // webSocket.close();
                };




                setTimeout(function(){
                    pushLog("")
                    pushLog("")
                    pushLog("")
                    pushLog("")
                    pushLog("")
                },10);




/*For reconnection on fail*/
  webSocket.onclose = function(e) {
    console.log('Socket is closed. Reconnect will be attempted in 1 second.', e.reason);
    setTimeout(function() {
      connect();
    }, 1000);
  };

  webSocket.onerror = function(err) {
    console.error('Socket encountered error: ', err.message, 'Closing socket');
    webSocket.close();
  };
  }
  connect();



                function websocketStringifySend(msg){
                    var tmp=JSON.stringify(msg);
                    pushLog("sending "+tmp);
                    webSocket.send(tmp);
                }

                function sendDebugText() {

                    var cmd = $('#debug-msg').val();

                    //     $("#console-text").text(cmd)
                    pushLog("sending <" + cmd + ">")
                    console.log("sending " + cmd);
                    webSocket.send(cmd);
                }
                

                
                //_-----------------------------------



                /*
                 * //Get
                 var bla = $('#txt_name').val();
                 
                 //Set
                 $('#txt_name').val(bla);
                 * 
                 * 
                 * 
                 */
                log = [];

                function printLog() {
                    var str = "";
                    var len = log.length;
                    var nlines = 5;
                    var start = len - nlines;
                    if (start < 0)
                        start = 0;
                    for (var i = start; i < len; i++) {
                        str += log[i] + "<br>";
                    }
                    $("#console-text").html(str);
                }
                function pushLog(msg) {
                    log.push(msg);
                    printLog();
                }