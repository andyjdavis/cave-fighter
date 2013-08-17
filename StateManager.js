//(function() {

window.game = window.game || { };

game.StateManager = function() {
    this.state = null;
    this.states = {
        PREGAME: 0,
        INGAME: 1,
        BETWEENLEVELS: 2
    };
};

game.StateManager.prototype.setState = function(s) {
    this.state = s; //should be doing some checking here
};

gState = new game.StateManager();

//}());
