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
  var log = $("#debugLog");
  if(log.length==0){
    log = $("<div id='debugLog'><h1>Debug Log</h1></div>");
    log.appendTo(document.body);
  }
  log.append($("<pre/>").text(msg));
}

var a = $('#render').get(0);
a.width = window.innerWidth;
a.height = window.innerHeight; 
var ctx = a.getContext('2d'); //'webgl' para 3d
ctx.fillStyle = 'green';
ctx.fillRect(0, 0, 100, 100)

var img = new Image();
img.src = './pictures/link_sprite_sheet_by_tiozacdasgalaxias-dayh0s6.png';


var move = {
  x : 0,
  y : 0
};



function cubo() {  
  ctx.fillRect(move.x, move.y, 10, 10);
}

var animation = [8,104,200];
var cnt = 0;
var t = performance.now();

function link(){
  var nt = performance.now();
  var delta = nt - t;
  ctx.drawImage(img, animation[cnt], 0 , 82 , 104, 100 , 100 , 80 , 104);
  if(delta>100){
    if (cnt==animation.length-1){
      cnt=0;      
    }else{
      cnt++;
    }
    t = nt;
  }
}
var tBlink = performance.now();

function step() {
  ctx.clearRect(0,0,a.width,a.height);
  var nt = performance.now();
  var delta = nt - tBlink;
  cubo();
  if(delta>10000){
    link();
  }  
  window.requestAnimationFrame(step);
}

step();


document.addEventListener('keydown', function(event) {
  if(event.keyCode == 37) {
    move.x--;
  }
  if(event.keyCode == 39) {
    move.x++;
  }
  if(event.keyCode == 40) {
    move.y++;
  }
  if(event.keyCode == 38) {
    move.y--
  }
});
