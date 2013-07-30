/*
 * A simple class that draws a block to the screen.
 * The block is affected by gravity, can jump and changes shape as it moves.
 *
 * This code does not come with any sort of warranty.
 * You are welcome to use it for whatever you like.
 * A credit would be nice but is not required.
 */


function drawRect(context, x, y, width, height, color) {
    context.fillStyle = color;
    context.fillRect(x, y, width, height);
}
function drawBox(context, x, y, width, height, color) {
    context.beginPath();
    context.rect(x, y, width, height);
    //context.fillStyle = 'yellow';
    //context.fill();
    context.lineWidth = 1;
    context.strokeStyle = color;
    context.stroke();
}
function drawText(context, text, font, style, x, y) {
    context.font = font;
    context.fillStyle = style;
    context.fillText(text, x, y);
}

function angle_to_vector(ang) {
    return [Math.cos(ang), Math.sin(ang)]
}
function calcDistance(vect) {
    return Math.sqrt(Math.pow(vect[0], 2) + Math.pow(vect[1], 2));
}
function calcVector(p1, p2) {
    return [p1[0] - p2[0], p1[1] - p2[1]];
}
function calcNormalVector(p1, p2) {
    var vect = calcVector(p1, p2);
    var h = calcDistance(vect);
    vect[0] = vect[0] / h;
    vect[1] = vect[1] / h;
    return vect;
}

var gCanvas = document.getElementById('gamecanvas');
var gContext = gCanvas.getContext('2d');

//http://ejohn.org/blog/simple-javascript-inheritance/#postcomment
/* Simple JavaScript Inheritance
 * By John Resig http://ejohn.org/
 * MIT Licensed.
 */
// Inspired by base2 and Prototype
(function(){
  var initializing = false, fnTest = /xyz/.test(function(){xyz;}) ? /\b_super\b/ : /.*/;
 
  // The base Class implementation (does nothing)
  this.Class = function(){};
 
  // Create a new Class that inherits from this class
  Class.extend = function(prop) {
    var _super = this.prototype;
   
    // Instantiate a base class (but only create the instance,
    // don't run the init constructor)
    initializing = true;
    var prototype = new this();
    initializing = false;
   
    // Copy the properties over onto the new prototype
    for (var name in prop) {
      // Check if we're overwriting an existing function
      prototype[name] = typeof prop[name] == "function" &&
        typeof _super[name] == "function" && fnTest.test(prop[name]) ?
        (function(name, fn){
          return function() {
            var tmp = this._super;
           
            // Add a new ._super() method that is the same method
            // but on the super-class
            this._super = _super[name];
           
            // The method only need to be bound temporarily, so we
            // remove it when we're done executing
            var ret = fn.apply(this, arguments);        
            this._super = tmp;
           
            return ret;
          };
        })(name, prop[name]) :
        prop[name];
    }
   
    // The dummy class constructor
    function Class() {
      // All construction is actually done in the init method
      if ( !initializing && this.init )
        this.init.apply(this, arguments);
    }
   
    // Populate our constructed prototype object
    Class.prototype = prototype;
   
    // Enforce the constructor to be what we expect
    Class.prototype.constructor = Class;
 
    // And make this class extendable
    Class.extend = arguments.callee;
   
    return Class;
  };
})();

function onImageLoad() {
    gImages.numImagesLoaded++;
}
ImageManager = Class.extend({
    numImagesLoaded: 0,
    images: null,
    imagedict: {
        'starship': 'resources/starship.png',
        'ufo': 'resources/ufo.png'
    },
    init: function() {
        this.images = Array(2);
        for (var name in this.imagedict) {
            this.images[name] = new Image();
            this.images[name].onload = onImageLoad;
            this.images[name].src = this.imagedict[name];
        }
    },
    getImage: function(name) {
        if (this.images.length == this.numImagesLoaded) {
            return this.images[name];
        } else {
            return null;
        }
    }
});
var gImages = new ImageManager();

Ship = Class.extend({
    init: function(pos, size, angular_vel, maxhealth) {
        this.pos = pos;
        this.size = size;
        this.angular_vel = angular_vel; //radians
        this.health = maxhealth;
        this.maxhealth = maxhealth;
        
        this.vel = [0, 0];
        this.angle = 0; //radians
    },
    update: function(dt) {
        this.pos[0] += this.vel[0] * dt * 10;
        this.pos[1] += this.vel[1] * dt * 10;
        
        this.angle += this.angular_vel * dt;
    },
    getCenter: function() {
        return [this.pos[0]+(this.size/2), this.pos[1]+(this.size/2)];
    },
    pointCollide: function(p) {
        var v = calcVector(p, this.getCenter());
        var dist = calcDistance(v);
        if (dist <= this.size/2) {
            return true;
        } else {
            return false;
        }
        /*if (p[0] < this.pos[0]
            || p[0] > (this.pos[0] + this.size)
            || p[1] < this.pos[1]
            || p[1] > (this.pos[1] + this.size)) {
            
            return false;
        }
        return true;*/
    },
    damage: function(n) {
        this.health -= n;
        if (this.health <= 0) {
            console.log('dead');
        }
    }
});

Ufo = Ship.extend({
    init: function(pos) {
        this.bullets = Array();
        this.bulletammo = 200;
        
        this._super(pos, 60, 1, 100);
    },
    draw: function() {
        var img = gImages.getImage('ufo');
        if (img) {
            //debug
            //drawRect(gContext, this.pos[0], this.pos[1], this.size, this.size, 'orange');
            
            gContext.save(); // save current state
            
            var xtranslate = this.pos[0]+this.size/2;
            var ytranslate = this.pos[1]+this.size/2;
            
            gContext.translate(xtranslate, ytranslate);
            gContext.rotate(this.angle); // rotate
            gContext.translate(-xtranslate, -ytranslate);
            gContext.drawImage(img, this.pos[0], this.pos[1], this.size, this.size);
            gContext.restore(); // restore original states (no rotation etc)
        }
        
        var maxwidth = 40;
        var width = (this.health/this.maxhealth) * maxwidth;
        drawRect(gContext, this.pos[0] + (this.size - maxwidth)/2, this.pos[1]+this.size, width, 4, 'red');
    },
    update: function(dt) {
        var vect = calcNormalVector(gPlayer.pos, this.pos);
        
        this.vel[0] = vect[0];
        this.vel[1] = vect[1];
        
        this._super(dt);
        
        if (gLoopcount % 10 == 0 && this.health < this.maxhealth) {
            this.health++;
        }
    }
});

Fighter = Ship.extend({
    init: function(pos) {
        this.bullets = Array();
        this.bulletammo = 200;
        
        this._super(pos, 20, 0, 50);
    },
    update: function(dt) {
        if (gLoopcount % 10 == 0 && this.bulletammo < 200) {
            this.bulletammo++;
        }
    
        if (gKeyState[73]) { //i - boosters
            var vect = angle_to_vector(this.angle - Math.PI/2);
            this.vel[0] += vect[0];
            this.vel[1] += vect[1];
        }
        if (gKeyState[65]) { //a - strafe left
            this.vel[0] += Math.sin(this.angle - (Math.PI/2)) * 0.5;
            this.vel[1] -= Math.cos(this.angle - (Math.PI/2)) * 0.5;
        }
        if (gKeyState[68]) { //d - strafe right
            this.vel[0] += Math.sin(this.angle + (Math.PI/2)) * 0.5;
            this.vel[1] -= Math.cos(this.angle + (Math.PI/2)) * 0.5;
        }

        if (gKeyState[74]) { //j - rotate left
            this.angular_vel = -2;
        } else if (gKeyState[76]) { //l - rotate right
            this.angular_vel = 2;
        } else {
            this.angular_vel = 0;
        }
        
        this._super(dt);
        this.vel[0] = this.applyFriction(this.vel[0]);
        this.vel[1] = this.applyFriction(this.vel[1]);
        
        if (gKeyState[32]) { //spacebar - guns
            this.shoot();
        }
        var rem = Array();
        for (var i in this.bullets) {
            this.bullets[i].pos[0] += this.bullets[i].vel[0];
            this.bullets[i].pos[1] += this.bullets[i].vel[1];
            if (this.bullets[i].pos[0] < 0
                || this.bullets[i].pos[0] > gCanvas.width
                || this.bullets[i].pos[1] < 0
                || this.bullets[i].pos[1] > gCanvas.width) {
                
                rem.push(i);
            }
        }
        for (var i in rem) {
            this.bullets.splice(i, 1);
        }
    },
    shoot: function() {
        if (this.bulletammo > 0) {
            var vect = angle_to_vector(this.angle - Math.PI/2);
            var halfsize = this.size/2;
            this.bullets.push(
                {
                    pos: [this.pos[0] + halfsize + halfsize * vect[0],
                          this.pos[1] + halfsize + halfsize * vect[1]],
                    vel: [vect[0]*10, vect[1]*10]
                }
            );
            this.bulletammo--;
        } else {
            //guns empty
        }
    },
    applyFriction: function(n) {
        if (n != 0) {
            if (Math.abs(n) < 0.01) {
                n = 0;
            } else {
                n *= 0.98;
            }
        }
        return n;
    },
    draw: function() {
        var img = gImages.getImage('starship');
        if (img) {
            gContext.save(); // save current state
            
            var xtranslate = this.pos[0]+this.size/2;
            var ytranslate = this.pos[1]+this.size/2;
            
            gContext.translate(xtranslate, ytranslate);
            gContext.rotate(this.angle); // rotate
            gContext.translate(-xtranslate, -ytranslate);
            gContext.drawImage(img, this.pos[0], this.pos[1], this.size, this.size);
            gContext.restore(); // restore original states (no rotation etc)
        }
        
        for (var i in this.bullets) {
            drawRect(gContext, this.bullets[i].pos[0], this.bullets[i].pos[1], 1, 1, 'white');
        }
    },
});

PlayerShip = Fighter.extend({
    init: function(pos) {
        this.hudcolor = "#88CEFA";
        this._super(pos);
        
        /*for (var x = gSettings.tileswidth - 1; x >= 0 ; x--) {
            for (var y = gSettings.tilesheight - 1; y >= 0; y--) {
                if (gMap[x][y] == gTiles.EMPTY) {
                    this._super([x,y]);
                    return;
                }
            }
        }*/
    },
    draw: function() {
        this._super();  
        //drawText(gContext, this.bulletammo, 'Arial 18pt', "#88CEFA", 10, 10);
        var height = (this.bulletammo/200)*40;
        drawRect(gContext, 20, 60 - height, 10, height, this.hudcolor);
        drawBox(gContext, 20, 20, 10, 40, this.hudcolor);
    }
});

gSettings = {
    tilesize: 20, 
    tileswidth: gCanvas.width/20,
    tilesheight: gCanvas.height/20,
    chanceToStartAlive: 0.45,
    simulationSteps: 3,
    deathLimit: 4,
    birthLimit: 4
}
/////////////////////////////////////////////////////
// MAP
gMap = null;

gTiles = {
    EMPTY: 0,
    SOLID: 1,
    TREASURE: 2
}

function createMapArray() {
    var map = Array(gSettings.tileswidth);
    for (var i = 0; i < gSettings.tileswidth; i++) {
        map[i] = Array(gSettings.tilesheight);
    }
    return map;
}
//this map generation code is based on http://gamedev.tutsplus.com/tutorials/implementation/cave-levels-cellular-automata/?utm_source=feedburner&utm_medium=feed&utm_campaign=Feed%3A+gamedevtuts+%28Gamedevtuts%2B%29
function countAliveNeighbours(map, x, y) {
    var count = 0;
    var neighbour_x = null, neighbour_y = null;
    for(var i=-1; i<2; i++){
        for(var j=-1; j<2; j++){
            neighbour_x = x+i;
            neighbour_y = y+j;
            //If we're looking at the middle point
            if(i == 0 && j == 0){
                //Do nothing, we don't want to add ourselves in!
            }
            //In case the index we're looking at it off the edge of the map
            else if(neighbour_x < 0 || neighbour_y < 0 || neighbour_x >= map.length || neighbour_y >= map[0].length){
                count = count + 1;
            }
            //Otherwise, a normal check of the neighbour
            else if(map[neighbour_x][neighbour_y]){
                count++;
            }
        }
    }
    return count;
}
function simulationStep(oldmap) {
    var newmap = createMapArray();
    for(var x=0; x<oldmap.length; x++){
        for(var y=0; y<oldmap[0].length; y++){
            var nbs = countAliveNeighbours(oldmap, x, y);
            //The new value is based on our simulation rules
            if(oldmap[x][y]){
                // Cell is alive. If it has too few neighbours, kill it.
                if(nbs < gSettings.deathLimit){
                    newmap[x][y] = gTiles.EMPTY;
                }
                else{
                    newmap[x][y] = gTiles.SOLID;
                }
            }
            else{
                //Cell is dead now. Check if it has the right number of neighbours to be 'born'
                if(nbs > gSettings.birthLimit){
                    newmap[x][y] = gTiles.SOLID;
                }
                else{
                    newmap[x][y] = gTiles.EMPTY;
                }
            }
        }
    }
    return newmap;
}
function placeTreasure() {
    //How hidden does a spot need to be for treasure?
    //I find 5 or 6 is good. 6 for very rare treasure.
    var treasureHiddenLimit = 5;
    for (var x=0; x < gSettings.tileswidth; x++) {
        for (var y=0; y < gSettings.tilesheight; y++) {
            if(gMap[x][y] == gTiles.EMPTY){
                var nbs = countAliveNeighbours(gMap, x, y);
                if(nbs >= treasureHiddenLimit){
                    gMap[x][y] = gTiles.TREASURE;
                    return true;
                }
            }
        }
    }
    return false;
}
function treasureAccessible() {
    // use flood fill to check treasure is accessible to the player
    
    //clone tiles so we can modify it
    var newmap = createMapArray();
    for(var x = 0; x < gSettings.tileswidth; x++) {
        for(var y = 0; y < gSettings.tilesheight; y++) {
            newmap[x][y] = gMap[x][y];
        }
    }
    
    var q = Array();
    q.push(gPlayerTile);
    var t = null;
    
    while (q.length > 0) {
        t = q.shift();
        if (t[0] < 0 || t[1] < 0 || t[0] >= gSettings.tileswidth || t[1] >= gSettings.tilesheight) {
            continue;
        }
        if (newmap[t[0]][t[1]] == gTiles.SOLID) {
            continue;
        }
        if (newmap[t[0]][t[1]] == gTiles.TREASURE) {
            //success!
            return true;
        }
        newmap[t[0]][t[1]] = gTiles.SOLID;
        
        q.push([t[0] - 1, t[1]]);
        q.push([t[0] + 1, t[1]]);
        q.push([t[0], t[1] - 1]);
        q.push([t[0], t[1] + 1]);
    }
    return false;
}
function generateMap() {
    var success = false;
    while (!success) {
        gMap = createMapArray();

        for(var x = 0; x < gSettings.tileswidth; x++){
            for(var y = 0; y < gSettings.tilesheight; y++){
                if(Math.random() < gSettings.chanceToStartAlive){
                    gMap[x][y] = gTiles.SOLID;
                }
            }
        }
    
        for (var i = 0; i < gSettings.simulationSteps; i++) {
            gMap = simulationStep(gMap);
        }
        success = placeTreasure();
        gPlayerTile = selectPlayerTile();
        gPlayer = new PlayerShip([gPlayerTile[0] * gSettings.tilesize, gPlayerTile[1] * gSettings.tilesize]);
        if (success) {
            success = treasureAccessible();
        }
    }
}
function selectPlayerTile() {
    if (!gMap) {
        console.log('NULL MAP WHEN POSITIONING PLAYER');
    }
    for (var x = gSettings.tileswidth - 1; x >= 0 ; x--) {
        for (var y = gSettings.tilesheight - 1; y >= 0; y--) {
            if (gMap[x][y] == gTiles.EMPTY) {
                return [x,y];
            }
        }
    }
}
// END MAP
/////////////////////////////////////////////////////

var gKeyState = Array();
function onKeyDown(event) {
    /*if (gState == State.PREGAME || gState == State.ENDGAME) {
        if (event.keyCode == 88) { // 'x' to start game
            newGame();
        }
    } else if (event.keyCode == 77) { // 'm' to toggle sound
        gSound.togglemute();
    } else if (gState == State.INGAME) {*/
        //console.log(event.keyCode);
        gKeyState[event.keyCode] = true;
    //}
}
function onKeyUp(event) {
    gKeyState[event.keyCode] = false;
}
window.addEventListener('keydown', onKeyDown, false);
window.addEventListener('keyup', onKeyUp, false);

function newGame() {
    generateMap(); //also positions the player
    
    //var pos = [gCanvas.width*Math.random(), gCanvas.height*Math.random()];
    //var size = 40;
    //gPlayer = new PlayerShip();
}
function updateGame() {
    gPlayer.update(dt);
    gUfo.update(dt);
    
    var rem = Array();
    for (var i in gPlayer.bullets) {
        if (gUfo.pointCollide(gPlayer.bullets[i].pos)) {
            gUfo.damage(1);
            rem.push(i);
        }
    }
    for (var i in rem) {
        gPlayer.bullets.splice(i, 1);
    }
}

function drawGame() {
    gContext.fillStyle = "black";
    gContext.fillRect(0 , 0, gCanvas.width, gCanvas.height);
    //context.clearRect(0, 0, canvas.width, canvas.height);
    
    var color = null;    
    for(var x = 0; x < gSettings.tileswidth; x++){
        for(var y = 0; y < gSettings.tilesheight; y++) {
            color = null;
            if (gMap[x][y] == gTiles.SOLID) {
                color = 'green';
            } else if (gMap[x][y] == gTiles.TREASURE) {
                color = 'yellow';
            } else {
                //empty. do nothing
            }
            if (color) {
                drawRect(gContext, x*gSettings.tilesize, y*gSettings.tilesize, gSettings.tilesize, gSettings.tilesize, color);
            }
        }
    }
    
    if (gPlayer) {
        gPlayer.draw();
    }
    gUfo.draw();
}

var gOldTime = Date.now();
var gNewTime = null;
var gLoopcount = 0;

gPlayer = null;
gPlayerTile = null; // only used during level generation
gUfo = new Ufo([40, 80], 40, 1);

newGame();

//executed 60/second
var mainloop = function() {
    gNewtime = Date.now();
    dt = (gNewtime - gOldTime)/1000;
    gOldTime = gNewtime;
    
    gLoopcount++;
    gLoopcount %= 1000;

    updateGame();
    drawGame();
};

var ONE_FRAME_TIME = 1000 / 60; // 60 per second
setInterval( mainloop, ONE_FRAME_TIME );
