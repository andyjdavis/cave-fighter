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
};
game.Ship.prototype.update = function(dt) {
    if (this.vel == undefined) {
        //how does this happen?
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
            //console.log('COLLISION');
            this.health--;
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
    var maxwidth = 40;
    var width = (this.health/this.maxhealth) * maxwidth;
    drawRect(gContext, drawpos[0] + (this.size - maxwidth)/2, drawpos[1]+this.size, width, 4, 'red');
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
game.Ship.prototype.damage = function(n) {
    this.health -= n;
    if (this.health <= 0) {
        console.log('dead');
    }
};

//}());
