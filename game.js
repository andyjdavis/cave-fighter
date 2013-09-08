/*
 * A simple class that draws a block to the screen.
 * The block is affected by gravity, can jump and changes shape as it moves.
 *
 * This code does not come with any sort of warranty.
 * You are welcome to use it for whatever you like.
 * A credit would be nice but is not required.
 */
(function() {

window.game = window.game || { };

gCanvas = document.getElementById('gamecanvas');
gContext = gCanvas.getContext('2d');

gSettings = {
    tilesize: 40,
    tileswidth: 15,
    tilesheight: 15
}
gTiles = {
    EMPTY: 0,
    SOLID: 1,
    TREASURE: 2
}


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
    gLevel = 0;
    nextLevel();
    gState.setState(gState.states.INGAME);
}
function nextLevel() {
    gLevel++;
    
    //var multiplier = Math.ceil(gLevel/2);
    var multiplier = 1.5;
    gSettings.tileswidth  = Math.floor(gSettings.tileswidth * multiplier);
    gSettings.tilesheight = Math.floor(gSettings.tilesheight * multiplier);
    console.log(gSettings.tileswidth);
    
    setupLevel();
}
function setupLevel() {
    gEnemies = Array();
    var mapgen = new game.MapGenerator();
    mapgen.generate(); // Also positions the player
    
    var monsters = (gLevel*gLevel) + 1;
    console.log("spawning"+monsters);
    for (var i = 0; i < monsters; i++) {
        spawnEnemy();
    }
}
function spawnEnemy() {
    var x = null, y = null, dist = null;
    while (x === null) {
        x = Math.floor(Math.random() * gSettings.tileswidth );
        y = Math.floor(Math.random() * gSettings.tilesheight );
        
        if (gMap[x][y] != gTiles.EMPTY) {
            x = null;
        }
        //check there are some empty tiles around to stop them getting stuck
        else if (gMap[x-1][y] != gTiles.EMPTY) {
            x = null;
        }
        else if (gMap[x+1][y] != gTiles.EMPTY) {
            x = null;
        }
        else if (gMap[x][y-1] != gTiles.EMPTY) {
            x = null;
        }
        else if (gMap[x][y+1] != gTiles.EMPTY) {
            x = null;
        }
        
        dist = calcDistance(calcVector(gPlayer.pos, [x * gSettings.tilesize, y * gSettings.tilesize]));
        if (dist < gSettings.tilesize * 4) {
            x = null;
        }
        
    }
    gEnemies.push(new game.Ufo([(x * gSettings.tilesize)+1, (y * gSettings.tilesize)+1]));
    //gEnemies.push(new game.Fighter([x * gSettings.tilesize, y * gSettings.tilesize]));
}

function updateGame(dt) {
    if (gPlayer) {
        gPlayer.update(dt);
        if (gPlayer.treasure) {
            // treasure reached
            nextLevel();
        }
    }

    for (var i in gEnemies) {
        gEnemies[i].update(dt);
    }
    
    /*var rem = Array();
    for (var i in gPlayer.bullets) {
        if (gUfo && gUfo.pointCollide(gPlayer.bullets[i].pos)) {
            gUfo.damage(1);
            rem.push(i);
        }
    }
    for (var i in rem) {
        gPlayer.bullets.splice(i, 1);
    }*/
}

function checkCollisions() {
    for (var i in gEnemies) {
        if (gPlayer.circleCollide(gEnemies[i])) {
            setupLevel();
        }
    }
}

function drawGame() {
    //if (gOldCamera[0] != gCamera[0] || gOldCamera[1] != gCamera[1]) {
        gContext.clearRect(0, 0, gCanvas.width, gCanvas.height);
        drawTerrain();
        drawText(gContext, gLevel, '18pt Arial', 'Blue', gCanvas.width - 30, 30);
    //}
    
    if (gPlayer) {
        gPlayer.draw();
    }
    for (var i in gEnemies) {
        gEnemies[i].draw();
    }
}
function drawTerrain() {
    gContext.fillStyle = 'Sienna';
    var lastDrawX = 0;
    var lastDrawY = 0;
    
    var drawX = null;
    var drawY = null;
    for(var x = 0; x < gSettings.tileswidth; x++){
        drawX = x * gSettings.tilesize - gCamera[0];
        if (drawX > gCanvas.width) {
            break;
        }
        if (drawX + gSettings.tilesize < 0) {
            continue;
        }
        for(var y = 0; y < gSettings.tilesheight; y++) {
            if (gMap[x][y] == gTiles.EMPTY) {
                continue;
            }
            drawY = y * gSettings.tilesize - gCamera[1];
            if (drawY > gCanvas.height) {
                break;
            }
            if (drawY + gSettings.tilesize < 0) {
                continue;
            }
            if (gMap[x][y] == gTiles.SOLID) {
                drawRect(gContext,
                         drawX,
                         drawY, 
                         gSettings.tilesize, 
                         gSettings.tilesize);
                lastDrawX = drawX;
                lastDrawY = drawY;
            } else if (gMap[x][y] == gTiles.TREASURE) {
                var img = gImages.getImage('exit');
                gContext.drawImage(img, 
                                   drawX, 
                                   drawY, 
                                   gSettings.tilesize, 
                                   gSettings.tilesize);
            }
        }
    }
}

function moveCamera() {
    //gOldCamera = gCamera;
    gCamera[0] = gPlayer.pos[0] - gCanvas.width/2;
    gCamera[1] = gPlayer.pos[1] - gCanvas.height/2;
    
    var mapsize = getMapSize();
    var maxcam = mapsize[0] - gCanvas.width;
    if (gCamera[0] > maxcam) {
        gCamera[0] = maxcam;
    }
    maxcam = mapsize[1] - gCanvas.height;
    if (gCamera[1] > maxcam) {
        gCamera[1] = maxcam;
    }
}

var gOldTime = Date.now();
var gNewTime = null;

var gPlayerTile = null; // only used during level generation
gCamera = [0, 0];
//var gOldCamera = [0, 0];
//var gDrawnTerrain = false;

newGame();

//executed 60/second
var mainloop = function() {
    gNewtime = Date.now();
    dt = (gNewtime - gOldTime)/1000;
    gOldTime = gNewtime;
    
    gLoopcount++;
    gLoopcount %= 1000;

    updateGame(dt);
    checkCollisions();
    moveCamera();
    drawGame();
};

var ONE_FRAME_TIME = 1000 / 60; // 60 per second
setInterval( mainloop, ONE_FRAME_TIME );

}());
