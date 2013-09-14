//(function() {

window.game = window.game || { };

game.Ship = function(pos, size, angularVel, maxhealth) {
    this.pos = pos;
    this.size = size;
    this.angular_vel = angularVel; //radians
    this.health = maxhealth;
    this.maxhealth = maxhealth;
    
    this.vel = [0, 0];
    this.angle = 0; //radians
    this.showlife = false;
};
game.Ship.prototype.update = function(dt) {
    if (this.vel == undefined || gMap == undefined) {
        return;
    }
    var deltaX = this.vel[0] * dt * 10;
    var deltaY = this.vel[1] * dt * 10;
    this.pos[0] += deltaX;
    this.pos[1] += deltaY;
    
    this.angle += this.angular_vel * dt;
    
    var tiles = convertRectToTiles(this.pos, this.size);
    var x = null, y = null;
    for (var i in tiles) {
        x = tiles[i][0];
        y = tiles[i][1];
        if (gMap[x][y] == gTiles.TREASURE) {
            //what do we do?
        } else if (gMap[x][y] == gTiles.SOLID) {
            //this.health--;
            this.pos[0] -= deltaX;
            this.pos[1] -= deltaY;
            this.vel[0] = 0;
            this.vel[1] = 0;
        } else {
            //console.log(gMap[tiles[i][0]][tiles[i][1]]);
        }
    }
};
game.Ship.prototype.draw = function(drawpos) {
    if (this.showlife) {
        var maxwidth = 40;
        var width = (this.health/this.maxhealth) * maxwidth;
        drawRect(gContext, drawpos[0] + (this.size - maxwidth)/2, drawpos[1]+this.size, width, 4, 'red');
    }
};
game.Ship.prototype.getCenter = function() {
    return [this.pos[0]+(this.size/2), this.pos[1]+(this.size/2)];
};
game.Ship.prototype.pointCollide = function(p) {
    var v = calcVector(p, this.getCenter());
    var dist = calcDistance(v);
    if (dist <= this.size/2) {
        return true;
    } else {
        return false;
    }
};
game.Ship.prototype.circleCollide = function(othership) {
    /*if (this.pos[0]+this.size < othership.pos[0] ||
        this.pos[0] > othership.pos[0] + othership.size ||
        this.pos[1]+this.size < othership.pos[1] ||
        this.pos[1] > othership.pos[1] + othership.size[1]) {
        
        console.log('NOT DEAD');
        return false;
    }
    return true;
    */
    var p1 = [this.pos[0] + this.size/2, this.pos[1] + this.size/2];
    var p2 = [othership.pos[0] + othership.size/2, othership.pos[1] + othership.size/2];
    var dist = calcDistance(calcVector(p1, p2));
    return dist < this.size/2 + othership.size/2;
};
game.Ship.prototype.damage = function(n) {
    this.health -= n;
    if (this.health <= 0) {
        console.log('dead');
    }
};
game.Ship.prototype.isOnScreen = function(drawpos) {
    if (drawpos[0] > gCanvas.width || drawpos[1] > gCanvas.height) {
        return false;
    }
    if (drawpos[0] + this.size < 0 || drawpos[1] + this.size < 0) {
        return false;
    }
    return true;
}

//}());
