
window.game = window.game || { };

function onSoundLoad() {
    gSounds.numSoundsLoaded++;
}
game.SoundManager = function() {
    this.numSoundsLoaded = 0;
    this.sounds = Array(3);
    this.enabled = true;
    
    try {
        //this._context = new webkitAudioContext();
        
        this.sounds['music'] = new Audio("resources/music.ogg");
        this.sounds['explosion'] = new Audio("resources/explosion.ogg");
        this.sounds['attack'] = new Audio("resources/attack.ogg");
        
        for (var key in this.sounds) {
            //this.sounds[key].preload = "auto";
            this.sounds[key].addEventListener('loadeddata', onSoundLoad);
        }
    } catch(e) {
        alert("Web Audio not supported");
    }
}
game.SoundManager.prototype.togglemute = function() {
    if (this.enabled) {
        this.stop('music');
        this.enabled = !this.enabled;
    } else {
        this.enabled = !this.enabled;
        this.play('music', true);
    }
}
game.SoundManager.prototype.play = function(name, loop) {
    try {
        if (this.enabled && name in this.sounds) {
            if (loop) {
                this.sounds[name].addEventListener('ended', function() {
                    this.currentTime = 0;
                    this.play();
                }, false);
            }
            if (this.sounds[name].duration > 0 && !this.sounds[name].paused) {
                //already playing
            } else {
                this.sounds[name].currentTime = 0;
                this.sounds[name].play();
            }
        }
    } catch(e) {
        console.log(e);
    }
}
game.SoundManager.prototype.stop = function(name) {
    if (this.enabled && name in this.sounds) {
        this.sounds[name].pause();
    }
}
game.SoundManager.prototype.volume = function(name, volume) {
    if (this.enabled && name in this.sounds) {
        this.sounds[name].volume = volume;
    }
}
game.SoundManager.prototype.isplaying = function(name) {
    if (this.enabled && name in this.sounds) {
        return !this.sounds[name].paused;
    }
}

gSounds = new game.SoundManager();

