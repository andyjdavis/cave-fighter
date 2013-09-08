//(function() {

window.game = window.game || { };

function onImageLoad() {
    gImages.numImagesLoaded++;
}

game.ImageManager = function() {
    this.numImagesLoaded = 0;
    this.imagedict = {
        'starship': 'resources/starship.png',
        'ufo': 'resources/ufodark.png',
        'exit': 'resources/exit.png'
    };
    this.images = Array(3);
    for (var name in this.imagedict) {
        this.images[name] = new Image();
        this.images[name].onload = onImageLoad;
        this.images[name].src = this.imagedict[name];
    }
};

game.ImageManager.prototype.getImage = function(name) {
    if (this.images.length == this.numImagesLoaded) {
        return this.images[name];
    } else {
        return null;
    }
};

gImages = new game.ImageManager();

//}());
