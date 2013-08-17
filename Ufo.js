//(function() {

window.game = window.game || { };

game.Ufo = function(pos) {
    var size = 40;
    var angularVel = 1;
    var maxHealth = 100;
    game.Ship.call(this, pos, size, angularVel, maxHealth);
}
game.Ufo.prototype = new game.Ship();
game.Ufo.prototype.constructor = game.Ufo;
 
game.Ufo.prototype.draw = function() {
    var drawpos = getDrawPos(this.pos);
        
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
        var vect = calcNormalVector(gPlayer.pos, this.pos);
           
        this.vel[0] = vect[0];
        this.vel[1] = vect[1];
    }
    
    //this._super(dt);
    game.Ship.prototype.update.call(this, dt);
    
    if (gLoopcount % 10 == 0 && this.health < this.maxhealth) {
        this.health++;
    }
};

//}());
