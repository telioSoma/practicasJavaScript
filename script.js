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
var state = 0;
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
  ctx.drawImage(img, animation[cnt], 320 , 82 , 104, 100 , 100 , 80 , 104);
  if(delta>500){
    if (cnt==animation.length-1){
      cnt=0;      
    }else{
      cnt++;
    }
    t = nt;
  }
}

var scene = [];
scene.push(new Element('./pictures/link_sprite_sheet_by_tiozacdasgalaxias-dayh0s6.png',
          8, 0, 82, 104, 200, 200, 80, 104, 'draw',{speed:[50,52,54],keys:[104,200,8],current:0}));
scene.push(new Element(null,
          null, null, 10, 10, 340, 340, null, null, 'rect', null));

function Element(path, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight, type, animation) {
  if(path!=null){
    this.img = new Image();
    this.img.src = path;
  }
  this.sx = sx;
  this.sy = sy;
  this.sWidth = sWidth;
  this.sHeight = sHeight;
  this.dx = dx;
  this.dy = dy;
  this.dWidth = dWidth;
  this.dHeight = dHeight;
  this.type = type;
  this.state = state;
  if(animation!=null){
    this.animation = new Animation(animation);
  }else{
    this.animation = null;
  }
}

function Animation(animation){
  this.speed = animation.speed;
  this.keys = animation.keys;
  this.current = animation.current;
  this.cntTicks = 1;
  this.totalTicks = 0;
}


var MyGame = {
  lastTick : 0,
  tickLength: 50,
  lastRender: 0}

function step(tFrame) {
  ctx.clearRect(0,0,a.width,a.height);
  var nextTick = MyGame.lastTick + MyGame.tickLength;
  var numTicks = 0;
  if (tFrame > nextTick) {
    var timeSinceTick = tFrame - MyGame.lastTick;
    numTicks = Math.floor( timeSinceTick / MyGame.tickLength );
  }
  queueUpdates( numTicks );  
  MyGame.lastRender = tFrame;
  render(tFrame);
  cubo();
  link();
  window.requestAnimationFrame(step);
}

function queueUpdates( numTicks ) {
  for(var i=0; i < numTicks; i++) {
    MyGame.lastTick = MyGame.lastTick + MyGame.tickLength; //Now lastTick is this tick.
  }
  update(MyGame.lastTick);
}

function render(tFrame){
  for(var i=0;i<scene.length;i++){
    if(scene[i].type=='draw'){
      ctx.drawImage(scene[i].img,scene[i].sx,scene[i].sy,scene[i].sWidth,
        scene[i].sHeight,scene[i].dx,scene[i].dy,scene[i].dWidth,scene[i].dHeight);
    }else if(scene[i].type=='rect'){
      ctx.fillRect(scene[i].dx, scene[i].dy, scene[i].sWidth, scene[i].sHeight);
    }
  }
}

//truñaco, hay que darle muchas vueltas, pero funciona
function update(lastTick){
  
  lastTick = lastTick/50;  
for(var i=0;i<scene.length;i++){
  scene[i].sy = state;
  if(scene[i].animation!=null){
    var element = scene[i];
    var animation = element.animation;
    var c = animation.current    
    if(lastTick==animation.speed[c]+animation.totalTicks){
      scene[i].sx = animation.keys[c];      
      animation.current++;
    }
    if(animation.current == animation.keys.length){
      animation.current = 0;
      animation.cntTicks++;
      animation.totalTicks = animation.speed[0]*animation.cntTicks;
    }
  }
}
}
step();


document.addEventListener('keydown', function(event) {
  if(event.keyCode == 37) {
    move.x--;
    state = 120;
  }
  if(event.keyCode == 39) {
    move.x++;
    state = '+x';
  }
  if(event.keyCode == 40) {
    move.y++;
    state = 0;
  }
  if(event.keyCode == 38) {
    move.y--;
    state = 0;
  }
});
