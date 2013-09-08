//(function() {

window.game = window.game || { };

game.PlayerFighter = function(pos) {
    this.hudcolor = "#88CEFA";
    this.treasure = false;
    game.Fighter.call(this, pos, true);
    this.showlife = false;
}
game.PlayerFighter.prototype = new game.Fighter();
game.PlayerFighter.prototype.constructor = game.PlayerFighter;
 
game.PlayerFighter.prototype.draw = function() {
    game.Fighter.prototype.draw.call(this);

    //var height = (this.bulletammo/200)*40;
    //drawRect(gContext, 20, 60 - height, 10, height, this.hudcolor);
    //drawBox(gContext, 20, 20, 10, 40, this.hudcolor);
};

game.PlayerFighter.prototype.update = function(dt) {
    if (gKeyState[73]) { //i - boosters
        var vect = angleToVector(this.angle - Math.PI/2);
        this.vel[0] += vect[0];
        this.vel[1] += vect[1];
    }
    if (gKeyState[65]) { //a - strafe left
        this.vel[0] += Math.sin(this.angle - (Math.PI/2)) * 0.25;
        this.vel[1] -= Math.cos(this.angle - (Math.PI/2)) * 0.25;
    }
    if (gKeyState[68]) { //d - strafe right
        this.vel[0] += Math.sin(this.angle + (Math.PI/2)) * 0.25;
        this.vel[1] -= Math.cos(this.angle + (Math.PI/2)) * 0.25;
    }

    if (gKeyState[74]) { //j - rotate left
        this.angular_vel = -2;
    } else if (gKeyState[76]) { //l - rotate right
        this.angular_vel = 2;
    } else {
        this.angular_vel = 0;
    }
    
    if (gKeyState[32]) { //spacebar - guns
        this.shoot();
    }
    game.Fighter.prototype.update.call(this, dt);
    
    var tiles = convertRectToTiles(this.pos, this.size);
    var x = null, y = null;
    for (var i in tiles) {
        x = tiles[i][0];
        y = tiles[i][1];
        if (gMap[x][y] == gTiles.TREASURE) {
            this.treasure = true;
        }
    }
}

//}());

