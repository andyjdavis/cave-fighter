//(function() {

window.game = window.game || { };

game.MapGenerator = function() {
    this.chanceToStartAlive = 0.45;
    this.simulationSteps = 3;
    this.deathLimit = 4;
    this.birthLimit = 4;
};

game.MapGenerator.prototype.generate = function() {
    var success = false;
    while (!success) {
        gMap = this.createMapArray();

        for(var x = 0; x < gSettings.tileswidth; x++){
            for(var y = 0; y < gSettings.tilesheight; y++){
                if(Math.random() < this.chanceToStartAlive){
                    gMap[x][y] = gTiles.SOLID;
                }
            }
        }
    
        for (var i = 0; i < this.simulationSteps; i++) {
            gMap = this.simulationStep(gMap);
        }
        
        //check the edges are solid
        for(var y = 0; y < gSettings.tilesheight; y++){
            gMap[0][y] = gTiles.SOLID;
            gMap[gSettings.tileswidth - 1][y] = gTiles.SOLID;
        }
        for(var x = 0; x < gSettings.tileswidth; x++){
            gMap[x][0] = gTiles.SOLID;
            gMap[x][gSettings.tilesheight - 1] = gTiles.SOLID;
        }
        
        success = this.placeTreasure();
        gPlayerTile = this.selectPlayerTile();
        var playerpos = [gPlayerTile[0] * gSettings.tilesize, gPlayerTile[1] * gSettings.tilesize];
        gPlayer = new game.PlayerFighter(playerpos);
        if (success) {
            success = this.treasureAccessible();
        }
    }
};

game.MapGenerator.prototype.createMapArray = function() {
    var map = Array(gSettings.tileswidth);
    for (var i = 0; i < gSettings.tileswidth; i++) {
        map[i] = Array(gSettings.tilesheight);
    }
    return map;
}
//this map generation code is based on http://gamedev.tutsplus.com/tutorials/implementation/cave-levels-cellular-automata/?utm_source=feedburner&utm_medium=feed&utm_campaign=Feed%3A+gamedevtuts+%28Gamedevtuts%2B%29
game.MapGenerator.prototype.countAliveNeighbours = function(map, x, y) {
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
game.MapGenerator.prototype.simulationStep = function(oldmap) {
    var newmap = this.createMapArray();
    for(var x=0; x<oldmap.length; x++){
        for(var y=0; y<oldmap[0].length; y++){
            var nbs = this.countAliveNeighbours(oldmap, x, y);
            //The new value is based on our simulation rules
            if(oldmap[x][y]){
                // Cell is alive. If it has too few neighbours, kill it.
                if(nbs < this.deathLimit){
                    newmap[x][y] = gTiles.EMPTY;
                }
                else{
                    newmap[x][y] = gTiles.SOLID;
                }
            }
            else{
                //Cell is dead now. Check if it has the right number of neighbours to be 'born'
                if(nbs > this.birthLimit){
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
game.MapGenerator.prototype.placeTreasure = function() {
    //How hidden does a spot need to be for treasure?
    //I find 5 or 6 is good. 6 for very rare treasure.
    var treasureHiddenLimit = 5;
    for (var x=0; x < gSettings.tileswidth; x++) {
        for (var y=0; y < gSettings.tilesheight; y++) {
            if(gMap[x][y] == gTiles.EMPTY){
                var nbs = this.countAliveNeighbours(gMap, x, y);
                if(nbs >= treasureHiddenLimit){
                    gMap[x][y] = gTiles.TREASURE;
                    return true;
                }
            }
        }
    }
    return false;
}
game.MapGenerator.prototype.treasureAccessible = function() {
    // use flood fill to check treasure is accessible to the player
    
    //clone tiles so we can modify it
    var newmap = this.createMapArray();
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
game.MapGenerator.prototype.selectPlayerTile = function() {
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

//}());
