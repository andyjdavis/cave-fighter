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
    tilesheight: 15,
    textcolor: 'Blue',
    textsize: '18pt Arial'
}
gTiles = {
    EMPTY: 0,
    SOLID: 1,
    TREASURE: 2
}


function onKeyDown(event) {
    state = gState.getState();
    if (state == gState.states.PREGAME || state == gState.states.ENDGAME) {
        if (event.keyCode == 68) {
            newGame();
        }
    }
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
    gState.setState(gState.states.INGAME);
    nextLevel();
    
    //gSounds.volume("music", 0.5);
    gSounds.play("music", true);
}
function nextLevel() {
    
    gLevel++;
    //var multiplier = Math.ceil(gLevel/2);
    //var multiplier = 1.5;
    //gSettings.tileswidth  = Math.floor(gSettings.tileswidth * multiplier);
    //gSettings.tilesheight = Math.floor(gSettings.tilesheight * multiplier);
    gSettings.tileswidth  = 100;
    gSettings.tilesheight = 100;
    
    setupLevel();
}
function setupLevel() {
    gEnemies = Array();
    var mapgen = new game.MapGenerator();
    mapgen.generate(); // Also positions the player
    
    //var monsters = (gLevel*gLevel) + 1;
    var monsters = 30;
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
            //nextLevel();
            gState.setState(gState.states.ENDGAME);
            return;
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
            gSounds.play("explosion");
            setupLevel();
        }
    }
}

function drawInstructions(showImages) {
    drawText(gContext, "Ascent pt 1", gSettings.textsize, gSettings.textcolor, gCanvas.width/3, 100);
    drawText(gContext, "You are alone and unarmed", gSettings.textsize, gSettings.textcolor, gCanvas.width/3, 200);
    drawText(gContext, "There is only one way out...", gSettings.textsize, gSettings.textcolor, gCanvas.width/3, 250);
    drawText(gContext, "A and D, strafe left and right", gSettings.textsize, gSettings.textcolor, gCanvas.width/3, 350);
    drawText(gContext, "J and L, turn left and right", gSettings.textsize, gSettings.textcolor, gCanvas.width/3, 400);
    drawText(gContext, "I to accelerate", gSettings.textsize, gSettings.textcolor, gCanvas.width/3, 450);
    if (showImages) {
        gContext.drawImage(gImages.getImage('exit'), 40, gCanvas.height/2, gSettings.tilesize, gSettings.tilesize);
        gContext.drawImage(gImages.getImage('starship'), gCanvas.width - 80, gCanvas.height/2, 30, 30);
    }
}
function drawGame() {
    var state = gState.getState();
    if (state == gState.states.LOADING) {
        drawInstructions(false);
        total = gSounds.sounds.length + gImages.images.length;
        loaded = gSounds.numSoundsLoaded + gImages.numImagesLoaded;
        if (loaded < total) {
            gState.setState(gState.states.PREGAME);
            var text = "Loading...    "+loaded+"/"+total;
            drawText(gContext, text, gSettings.textsize, gSettings.textcolor, gCanvas.width/3, 500);
            gContext.clearRect(0, 0, gCanvas.width, gCanvas.height);
            return;
        }
    } else if (state == gState.states.PREGAME) {
        drawInstructions(true);
        drawText(gContext, "Press strafe right to begin", gSettings.textsize, "white", gCanvas.width/3, 500);
    } else if (state == gState.states.INGAME) {
        //if (gOldCamera[0] != gCamera[0] || gOldCamera[1] != gCamera[1]) {
            gContext.clearRect(0, 0, gCanvas.width, gCanvas.height);
            drawTerrain();
            //drawText(gContext, gLevel, gSettings.textsize, gSettings.textcolor, gCanvas.width - 30, 30);
        //}
        
        if (gPlayer) {
            gPlayer.draw();
        }
        for (var i in gEnemies) {
            gEnemies[i].draw();
        }
    } else if (state == gState.states.ENDGAME) {
        drawText(gContext, "Ascent pt 1", gSettings.textsize, gSettings.textcolor, gCanvas.width/3, 100);
        drawText(gContext, "Congratulations on your valiant escape!", gSettings.textsize, gSettings.textcolor, gCanvas.width/3, 200);
        drawText(gContext, "The cave is randomly generated", gSettings.textsize, gSettings.textcolor, gCanvas.width/3, 250);
        drawText(gContext, "Press strafe right to play again", gSettings.textsize, gSettings.textcolor, gCanvas.width/3, 350);
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

//executed 60/second
var mainloop = function() {
    state = gState.getState();
    if (state == gState.states.INGAME) {
        gNewtime = Date.now();
        dt = (gNewtime - gOldTime)/1000;
        gOldTime = gNewtime;
        
        gLoopcount++;
        gLoopcount %= 1000;

        updateGame(dt);
        checkCollisions();
        moveCamera();
    }
    drawGame();
};

var ONE_FRAME_TIME = 1000 / 60; // 60 per second
setInterval( mainloop, ONE_FRAME_TIME );

}());
