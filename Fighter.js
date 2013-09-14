//(function() {

window.game = window.game || { };

game.Fighter = function(pos, player) {
    this.player = player;
    this.bullets = Array();
    this.bulletammo = 200;
    game.Ship.call(this, pos, 20, 0, 50);
}
game.Fighter.prototype = new game.Ship();
game.Fighter.prototype.constructor = game.Fighter;
 
game.Fighter.prototype.draw = function() {
    var drawpos = getDrawPos(this.pos);
    //drawpos[0] -= ;
    //drawpos[0] -= 2;
    var drawsize = this.size+2;
    
    var img = gImages.getImage('starship');
    if (img) {
        gContext.save(); // save current state
        
        var xtranslate = drawpos[0]+this.size/2;
        var ytranslate = drawpos[1]+this.size/2;
        
        gContext.translate(xtranslate, ytranslate);
        gContext.rotate(this.angle); // rotate
        gContext.translate(-xtranslate, -ytranslate);
        gContext.drawImage(img, drawpos[0]-1, drawpos[1]-1, drawsize, drawsize);
        gContext.restore(); // restore original states (no rotation etc)
    }
    game.Ship.prototype.draw.call(this, drawpos);
    
    /*gContext.beginPath();
      gContext.arc(drawpos[0] + this.size/2 +2, drawpos[1]+this.size/2 + 2, this.size/2, 0, 2 * Math.PI, false);
      gContext.lineWidth = 2;
      gContext.strokeStyle = '#003300';
      gContext.stroke();*/
    
    /*for (var i in this.bullets) {
        drawpos = getDrawPos(this.bullets[i].pos);
        drawRect(gContext, drawpos[0], drawpos[1], 1, 1, 'white');
    }*/
};
game.Fighter.prototype.update = function(dt) {
    if (gLoopcount % 10 == 0 && this.bulletammo < 200) {
        this.bulletammo++;
    }
    
    if (!this.player) {
        if (gPlayer != undefined) {
            if (gKeyState[74]) { //j - rotate left
                this.angular_vel = -2;
            } else if (gKeyState[76]) { //l - rotate right
                this.angular_vel = 2;
            } else {
                this.angular_vel = 0;
            }


            var vect = angleToVector(this.angle - Math.PI/2);
            this.vel[0] += vect[0];
            this.vel[1] += vect[1];
               
            //this.vel[0] = vect[0];
            //this.vel[1] = vect[1];
        }
    }
    
    game.Ship.prototype.update.call(this, dt);
    this.vel[0] = this.applyFriction(this.vel[0]);
    this.vel[1] = this.applyFriction(this.vel[1]);
    
    /*var rem = Array();
    var mapsize = getMapSize();
    var tile = null;
    for (var i in this.bullets) {
        this.bullets[i].pos[0] += this.bullets[i].vel[0];
        this.bullets[i].pos[1] += this.bullets[i].vel[1];
        if (this.bullets[i].pos[0] < 0
            || this.bullets[i].pos[0] > mapsize[0]
            || this.bullets[i].pos[1] < 0
            || this.bullets[i].pos[1] > mapsize[1]) {
            
            rem.push(i);
        } else {
            tile = convertPointToTile(this.bullets[i].pos);
            if (gMap[tile[0]][tile[1]] == gTiles.SOLID) {
                rem.push(i);
            }
        }
    }
    for (var i in rem) {
        this.bullets.splice(i, 1);
    }*/
};
game.Fighter.prototype.shoot = function() {
    if (this.bulletammo > 0) {
        var vect = angleToVector(this.angle - Math.PI/2);
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
};
game.Fighter.prototype.applyFriction = function(n) {
    if (n != 0) {
        if (Math.abs(n) < 0.01) {
            n = 0;
        } else {
            n *= 0.98;
        }
    }
    return n;
};
    
//});
