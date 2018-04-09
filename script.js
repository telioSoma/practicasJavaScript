console.log("estas dentro");
function moveOn() {
  var answer = confirm("Ready to move on?");
  if (answer) window.location = "http://google.com";
  console.log("estas dentro de la funcion");
}
//setTimeout(moveOn, 10000);
function debugLog(msg) {
  var log = document.getElementById("debugLog");
  if (!log) {
    log = document.createElement("div");
    log.id= "debugLog";
    log.innerHTML = "<h1>Debug Log</h1>"
    document.body.appendChild(log);
  }
  var pre = document.createElement("pre");
  var text = document.createTextNode(msg);
  pre.appendChild(text);
  log.appendChild(pre);
}

function hide(e, reflow) {
  var element = document.getElementById(e);
  if(reflow){
    element.style.display ="none";
  }
  else{
    element.style.visibility = "hidden";
  }
}
function highlight(e) {
  var element = document.getElementById(e);
  if (!element.className)  e.className = "hilite";
  else element.className += "hilite";
}
function debug(msg) {
  var log = $("#debuglog");
  if(!log){
    log = $("<div id='debuglog'><h1>Debug Log</h1></div>");
    log.appendTo(document.body);
  }
  log.append($("<pre/>").text(msg));
}
