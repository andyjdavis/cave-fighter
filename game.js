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
    tileswidth: 20,//100,
    tilesheight: 20//100
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
    nextLevel();
    gState.setState(gState.states.INGAME);
}
function nextLevel() {
    gEnemies = Array();
    var mapgen = new game.MapGenerator();
    mapgen.generate(); // Also positions the player
    
    spawnEnemy();
}
function spawnEnemy() {
    var x = null, y = null;
    while (x === null) {
        x = Math.floor(Math.random() * gSettings.tileswidth);
        y = Math.floor(Math.random() * gSettings.tilesheight);
        if (gMap[x][y] != gTiles.EMPTY) {
            x = null;
        }
    }
    //gEnemies.push(new game.Ufo([x * gSettings.tilesize, y * gSettings.tilesize]));
    gEnemies.push(new game.Fighter([x * gSettings.tilesize, y * gSettings.tilesize]));
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
                drawRect(gContext, x * gSettings.tilesize - gCamera[0], y * gSettings.tilesize - gCamera[1], gSettings.tilesize, gSettings.tilesize, color);
            }
        }
    }
    
    if (gPlayer) {
        gPlayer.draw();
    }
    for (var i in gEnemies) {
        gEnemies[i].draw();
    }
}

function moveCamera() {
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

newGame();

//executed 60/second
var mainloop = function() {
    gNewtime = Date.now();
    dt = (gNewtime - gOldTime)/1000;
    gOldTime = gNewtime;
    
    gLoopcount++;
    gLoopcount %= 1000;

    updateGame(dt);
    moveCamera();
    drawGame();
};

var ONE_FRAME_TIME = 1000 / 60; // 60 per second
setInterval( mainloop, ONE_FRAME_TIME );

}());
