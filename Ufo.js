//(function() {

window.game = window.game || { };

gUfoState = {
    waiting: 1,
    wandering: 2, 
    charging: 3
}

game.Ufo = function(pos) {
    var size = 40;
    var angularVel = 1;
    var maxHealth = 100;
    game.Ship.call(this, pos, size, angularVel, maxHealth);
    this.state = gUfoState.waiting;
    //this.goal = null;
}
game.Ufo.prototype = new game.Ship();
game.Ufo.prototype.constructor = game.Ufo;
 
game.Ufo.prototype.draw = function() {
    var drawpos = getDrawPos(this.pos);
    if (!this.isOnScreen(drawpos)) {
        return;
    }
    
    var img = gImages.getImage('ufo');
    if (img) {
        //debug
        //drawRect(gContext, this.pos[0], this.pos[1], this.size, this.size, 'orange');
        
        gContext.save(); // save current state
        
        var xtranslate = drawpos[0]+this.size/2;
        var ytranslate = drawpos[1]+this.size/2;
        
        gContext.translate(xtranslate, ytranslate);
        gContext.rotate(this.angle); // rotate
        gContext.translate(-xtranslate, -ytranslate);
        gContext.drawImage(img, drawpos[0], drawpos[1], this.size, this.size);
        gContext.restore(); // restore original states (no rotation etc)
    }
    game.Ship.prototype.draw.call(this, drawpos);
};
game.Ufo.prototype.update = function(dt) {
    if (gPlayer != undefined) {
        var vect = null;
        if (this.state != gUfoState.charging) {
            if (calcDistance(calcVector(this.pos, gPlayer.pos)) < gSettings.tilesize * 5) {
                this.state = gUfoState.charging;
                //to do play angry sound
            } /*else if (this.state == gUfoState.wandering) {
                if (this.goal == null) {
                    console.log("need goal");
                    var tile = convertPointToTile(this.pos);
                    tile [0] += Math.round(Math.random());
                    tile [1] += Math.round(Math.random());
                    if (gMap[tile[0]][tile[1]] == gTiles.EMPTY) {
                        this.goal = [tile[0]*(gSettings.tilesize/2), tile[1]*(gSettings.tilesize/2)];
                        console.log(this.pos);
                        console.log(this.goal);
                    }
                } else if (convertPointToTile(this.pos) == convertPointToTile(this.goal)) {
                    this.goal = null;
                }
                if (this.goal != null) {
                    vect = calcNormalVector(this.goal, this.pos);
                }
            }*/
        } else {
            //charging
            if (calcDistance(calcVector(this.pos, gPlayer.pos)) > gSettings.tilesize * 10) {
                this.state = gUfoState.waiting;
                //to do play calm sound
            } else {
                vect = calcNormalVector(gPlayer.pos, this.pos);
            }
        }
        if (vect != null) {
            this.vel[0] = 6 * vect[0];
            this.vel[1] = 6 * vect[1];
        }
    }
    
    //this._super(dt);
    game.Ship.prototype.update.call(this, dt);
    
    if (gLoopcount % 10 == 0 && this.health < this.maxhealth) {
        this.health++;
    }
};

//}());
