
//Inicializamos el canvas
var a = $('#render').get(0);
a.width = window.innerWidth;
a.height = window.innerHeight;
var ctx = a.getContext('2d'); //'webgl' para 3d
var state = 0;
var scene = [];
var lastKey = 0;
var andar = false;
//Valores del juego a lo mejor hay que meterlo todo aquí
var MyGame = {
    lastTick : 0,
    tickLength: 50,
    lastRender: 0}

//Estatico para hacer pruebas
ctx.fillStyle = 'green';
var img = new Image();
img.src = './pictures/link_sprite_sheet_by_tiozacdasgalaxias-dayh0s6.png';
var move = {
    x : 0,
    y : 0
  };
//Funcion para hacer un cubo que se mueve con las flechas
function cubo() {  
ctx.fillRect(move.x, move.y, 10, 10);
}
//Funcion para animar el sprite de link
var animation = [108,204,300,396,492,588,684,780,876,10];
var cnt = 0;
var t = performance.now();
function link(){
var nt = performance.now();
var delta = nt - t;
ctx.drawImage(img, animation[cnt], 417 , 87 , 100, 100 , 100 , 80 , 104);
if(delta>100){
    if (cnt==animation.length-1){
    cnt=0;
    }else{
    cnt++;
    }
    t = nt;
}
}
//Aquí comienza la parte dinámica

//Constructor de elemento (lo que deseamos pintar en pantalla)
function Element(atributes) {  
    this.dx = atributes.dx;
    this.dy = atributes.dy;
    this.dWidth = atributes.dWidth;
    this.dHeight = atributes.dHeight;
    this.haveHitbox = atributes.haveHitbox;
    this.visibleHitbox = false;
}
Element.prototype.getHitbox = function (){
    if(this.haveHitbox){
        var values = {
            x : this.dx,
            y : this.dy,
            width : this.dWidth,
            height : this.dHeight,
        }
        return values;
    }else{
        return null;
    }
}
//Contructor de una animación
function Animation(animation){
    this.speed = animation.speed;
    this.keysX = animation.keysX;
    this.keyY = animation.keyY;    
    this.currentPhotogram = animation.currentPhotogram;    
}
//Constructor de un dibujo heredadndo de Element
function Picture(atributes, animation){
    Element.call(this, atributes);
    this.img = new Image();
    this.img.src = atributes.path;
    this.sx = atributes.sx;
    this.sy = atributes.sy;
    this.sWidth = atributes.sWidth;
    this.sHeight = atributes.sHeight;
    this.currentAnimation = 0;
    this.animation = animation;
    this.cntTicks = 1;
    this.lastTick = 0;
}
Picture.prototype = Object.create(Element.prototype);
//Funcion para pintar el en el canvas
Picture.prototype.draw = function(){
    ctx.drawImage(this.img,this.sx,this.sy,this.sWidth,
        this.sHeight,this.dx,this.dy,this.dWidth,this.dHeight);
}
//Contstructor de un rectangulo
function Stroke(atributes){
    Element.call(this, atributes);
    this.color = atributes.color;
}
Stroke.prototype = Object.create(Element.prototype);
//Funcion para pintar el rectangulo
Stroke.prototype.draw = function(){
    ctx.strokeRect(this.dx, this.dy, this.dWidth, dHeight);
}
//Constructor Hitbox
// function Hitbox(hitbox){
//     this.x = hitbox.x;
//     this.y = hitbox.y;
//     this.width = hitbox.width;
//     this.height = hitbox.height;
// }
//Funcion para calcular si hay colision
Element.prototype.colisionCalcule = function(element){
    var a = this.getHitbox();
    var b = element.getHitbox();
    var i = null;
    if (a.x <= b.x + b.width &&
        a.x + a.width >= b.x &&
        a.y <= b.y + b.height &&
        a.height + a.y >= b.y){
        if(a.x == b.x + b.width ){
            console.log('Se ha chocado por la izquierda');
            return 5;
        }
        if(a.x + a.width == b.x){
            console.log('Se ha chocado por la derecha');
            return 7;
        }
        if(a.y == b.y + b.height){
            console.log('Se ha chocado por arriba');
            return  6;
        }
        if(a.height + a.y == b.y){
            console.log('Se ha chocado por abajo');
            return 4;
        }
        // console.log('X de a : ' + a.x + ' X de b : '+b.x+ ' Y de a : ' + a.y + ' Y de b : '+b.y);
        // console.log('W de a : ' + a.width + ' W de b : '+b.width+ ' H de a : ' + a.height + ' H de b : '+b.height);       
    }else{
        return false;
    }
}

//Creacion del dibujo
var pila=[
    new Animation({speed: [0,50,2,2], keysX: [8,104,200,8], keyY: 0, currentPhotogram: 0}),
    new Animation({speed: [0,50,2,2], keysX: [8,104,200,8], keyY: 108, currentPhotogram: 0}),
    new Animation({speed: [0], keysX: [8], keyY: 216, currentPhotogram: 0}),
    new Animation({speed: [0,50,2,2], keysX: [8,100,200,8], keyY: 316, currentPhotogram: 0}),
    new Animation({speed: [0,2,2,2,2,2,2,2,2,2,2], keysX: [108,204,300,396,492,588,684,780,876,10],
        keyY: 417, currentPhotogram: 0}),
    new Animation({speed: [0,2,2,2,2,2,2,2,2,2,2], keysX: [100,196,292,388,484,580,676,772,868,8],
        keyY: 521, currentPhotogram: 0}),
    new Animation({speed: [0,2,2,2,2,2,2,2,2,2,2], keysX: [108,204,300,396,492,588,684,780,876,10],
        keyY: 625, currentPhotogram: 0}),
    new Animation({speed: [0,2,2,2,2,2,2,2,2,2,2], keysX: [100,196,292,388,484,580,676,772,868,8],
        keyY: 730, currentPhotogram: 0})
]
var pila2=[
    new Animation({speed: [0,50,2,2], keysX: [8,104,200,8], keyY: 11, currentPhotogram: 0}),
    new Animation({speed: [0,50,2,2], keysX: [8,104,200,8], keyY: 108, currentPhotogram: 0}),
    new Animation({speed: [0], keysX: [8], keyY: 216, currentPhotogram: 0}),
    new Animation({speed: [0,50,2,2], keysX: [8,100,200,8], keyY: 316, currentPhotogram: 0}),
    new Animation({speed: [0,2,2,2,2,2,2,2,2,2,2], keysX: [108,204,300,396,492,588,684,780,876,10],
        keyY: 418, currentPhotogram: 0}),
    new Animation({speed: [0,2,2,2,2,2,2,2,2,2,2], keysX: [100,196,292,388,484,580,676,772,868,8],
        keyY: 520, currentPhotogram: 0}),
    new Animation({speed: [0,2,2,2,2,2,2,2,2,2,2], keysX: [108,204,300,396,492,588,684,780,876,10],
        keyY: 626, currentPhotogram: 0}),
    new Animation({speed: [0,2,2,2,2,2,2,2,2,2,2], keysX: [100,196,292,388,484,580,676,772,868,8],
        keyY: 730, currentPhotogram: 0})
]
var dibujo = new Picture({
    path: './pictures/link_sprite_sheet_by_tiozacdasgalaxias-dayh0s6.png',
    sx: 8,
    sy: 0,
    sWidth: 88,
    sHeight: 100,
    dx: 192,
    dy: 100,
    dWidth: 88,
    dHeight: 100,
    haveHitbox : true
},pila);

var dibujo2 = new Picture({
    path: './pictures/link_sprite_sheet_by_tiozacdasgalaxias-dayh0s6.png',
    sx: 8,
    sy: 12,
    sWidth: 72,
    sHeight: 92,
    dx: 192,
    dy: 220,
    dWidth: 72,
    dHeight: 92,
    haveHitbox : true
},pila2);
dibujo.visibleHitbox = true;
dibujo2.visibleHitbox = true;
scene.push(dibujo);
scene.push(dibujo2);
//Funcion recursiva que pinta constantemente
function step(tFrame) {
    //limpiar el canvas
    ctx.clearRect(0,0,a.width,a.height);
    //Seteamos el timestamp en el que considermos que cambia el Tick
    var nextTick = MyGame.lastTick + MyGame.tickLength;
    var numTicks = 0;
    //Si el timestamp del momento de iniciar es mayor a la suma del 
    //ultimo Tick y la longitud del mismo ajustamos los valores y 
    //y rellenamo el valor "numTicks"
    if (tFrame > nextTick) {
        var timeSinceTick = tFrame - MyGame.lastTick;
        numTicks = Math.floor( timeSinceTick / MyGame.tickLength );
    }
    //Esta funcion actualiza la escena con todo lo que queremos que
    //se pinte, solo hará el update en el momento que hagamos un Tick
    queueUpdates( numTicks );
    MyGame.lastRender = tFrame;
    //La funcion render es la que pinta lo contenido en la escena
    render(tFrame);
    cubo();
    link();
    walk();
    //funcion que inicia la recursividad
    window.requestAnimationFrame(step);
}
//Aqui, en el caso de que hayamos arrancado la funcion a destiempo 
//se nivelará con los Ticks que han pasado. En caso contrario solo 
//entrará cuando hay Ticks completos.
function queueUpdates( numTicks ) {
    for(var i=0; i < numTicks; i++) {
        MyGame.lastTick = MyGame.lastTick + MyGame.tickLength;
    }
    update(MyGame.lastTick);
}
//Esta funcion recorre la escena y va pintando cada elemento que contiene
function render(tFrame){
    for(var i=0;i<scene.length;i++){
        scene[i].draw();
        if (scene[i].visibleHitbox){
            var hitbox = scene[i].getHitbox();
            ctx.strokeRect(hitbox.x,hitbox.y,hitbox.width,hitbox.height);
        }
    }
}

//Esta funcion actualiza la escena
//(truñaco, hay que darle muchas vueltas, pero funciona)
function update(lastTick){
    lastTick = lastTick/50;  
    for(var i=0;i<scene.length;i++){
        var currentAnimation = scene[i].currentAnimation;
        var element = scene[i];
    if(scene[i].animation!=null){
        var animation = element.animation[currentAnimation];
        var c = animation.currentPhotogram;
        // console.log('Fotograma: '+c );
        // console.log('Animacion: '+element.currentAnimation);
        // console.log('X: ' +element.sx + ' - Y: '+ element.sy);
        element.sy = animation.keyY;
        if(lastTick-element.lastTick>=animation.speed[c]){
        element.sx = animation.keysX[c];
        element.lastTick = lastTick;
        animation.currentPhotogram++;
        }
        if(animation.currentPhotogram == animation.keysX.length){
        animation.currentPhotogram = 0;
        element.cntTicks++;
        }
    }
    }
}
step();
//Funcion que captura los eventos de teclado
document.addEventListener('keydown', function(event) {
    //Jugador 2 <-->
    if(event.keyCode == 37) {
        if(lastKey!=dibujo2.currentAnimation){
            dibujo2.animation[dibujo2.currentAnimation].currentPhotogram = 0;
        }
        dibujo2.dx-=4;
        dibujo2.currentAnimation = 5;
        lastKey = 5;      
    }
    if(event.keyCode == 38) {
        if(lastKey!=dibujo2.currentAnimation){
            dibujo2.animation[dibujo2.currentAnimation].currentPhotogram = 0;
        }
        dibujo2.dy-=4;
        dibujo2.currentAnimation = 6;
        lastKey = 6;
    }
    if(event.keyCode == 39) {
        if(lastKey!=dibujo2.currentAnimation){
            dibujo2.animation[dibujo2.currentAnimation].currentPhotogram = 0;
        }
        dibujo2.dx+=4;
        dibujo2.currentAnimation = 7;
        lastKey = 7;
    }
    if(event.keyCode == 40) {
        if(lastKey!=dibujo2.currentAnimation){
            dibujo2.animation[dibujo2.currentAnimation].currentPhotogram = 0;
        }
        dibujo2.dy+=4;
        dibujo2.currentAnimation = 4;
        lastKey = 4;
    }
    //Jugador 1 (WASD)
    //S
    if(event.keyCode == 83) {
        if(lastKey!=dibujo.currentAnimation){
            dibujo.animation[dibujo.currentAnimation].currentPhotogram = 0;
        }      
        andar = true;        
        dibujo.currentAnimation = 4;
        lastKey = 4;
      }
    //A
    if(event.keyCode == 65) {
        if(lastKey!=dibujo.currentAnimation){
            dibujo.animation[dibujo.currentAnimation].currentPhotogram = 0;
        }       
        andar = true;   
        dibujo.currentAnimation = 5;
        lastKey = 5;
    }
    //W
    if(event.keyCode == 87) {
        if(lastKey!=dibujo.currentAnimation){
            dibujo.animation[dibujo.currentAnimation].currentPhotogram = 0;
        }        
        andar = true;
        dibujo.currentAnimation = 6;
        lastKey = 6;
    }
    //D
    if(event.keyCode == 68) {
        if(lastKey!=dibujo.currentAnimation){
            dibujo.animation[dibujo.currentAnimation].currentPhotogram = 0;
        }        
        andar = true;               
        dibujo.currentAnimation = 7;
        lastKey = 7;
    }
    //console.log(event.keyCode);
  });
function walk(){
    if(andar){
        if (lastKey==7&&dibujo.colisionCalcule(dibujo2)!= lastKey){
            dibujo.dx+=4;
        }
        if (lastKey==5&&dibujo.colisionCalcule(dibujo2)!= lastKey){
            dibujo.dx-=4;
        }
        if (lastKey==4&&dibujo.colisionCalcule(dibujo2)!= lastKey){
            dibujo.dy+=4;
        }
        if (lastKey==6&&dibujo.colisionCalcule(dibujo2)!= lastKey){
            dibujo.dy-=4;
        }
    }
}
document.addEventListener('keyup', function(event) {
    //Jugador 2 <-->
    if(event.keyCode == 37) {
        if(lastKey!=dibujo2.currentAnimation){
            dibujo2.animation[dibujo2.currentAnimation].currentPhotogram = 0;
        }
        dibujo2.currentAnimation = 1;            
    }
    if(event.keyCode == 38) {
        if(lastKey!=dibujo2.currentAnimation){
            dibujo2.animation[dibujo2.currentAnimation].currentPhotogram = 0;
        }
        dibujo2.currentAnimation = 2;
    }
    if(event.keyCode == 39) {
        if(lastKey!=dibujo2.currentAnimation){
            dibujo2.animation[dibujo2.currentAnimation].currentPhotogram = 0;
        }
        dibujo2.currentAnimation = 3;
    }
    if(event.keyCode == 40) {
        if(lastKey!=dibujo2.currentAnimation){
            dibujo2.animation[dibujo2.currentAnimation].currentPhotogram = 0;
        }
        dibujo2.currentAnimation = 0;
    }
    //Jugador 1 (WASD)
    //S
    if(event.keyCode == 83) {
        if(lastKey!=dibujo.currentAnimation){
            dibujo.animation[dibujo.currentAnimation].currentPhotogram = 0;
        }
        dibujo.currentAnimation = 0;
        andar = false;
      }
    //A
    if(event.keyCode == 65) {
        if(lastKey!=dibujo.currentAnimation){
            dibujo.animation[dibujo.currentAnimation].currentPhotogram = 0;
        }     
        dibujo.currentAnimation = 1;
        andar = false;
    }
    //W
    if(event.keyCode == 87) {
        if(lastKey!=dibujo.currentAnimation){
            dibujo.animation[dibujo.currentAnimation].currentPhotogram = 0;
        }
        dibujo.currentAnimation = 2;
        andar = false;
    }
    //D
    if(event.keyCode == 68) {
        if(lastKey!=dibujo.currentAnimation){
            dibujo.animation[dibujo.currentAnimation].currentPhotogram = 0;
        } 
        dibujo.currentAnimation = 3;
        andar = false;
    }
});
