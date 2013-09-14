//(function() {

window.game = window.game || { };

game.StateManager = function() {
    this.states = {
        PREGAME: 0,
        INGAME: 1,
        BETWEENLEVELS: 2,
        END: 3
    };
    this.state = this.states.PREGAME;
};

game.StateManager.prototype.setState = function(s) {
    this.state = s; //should be doing some checking here
};
game.StateManager.prototype.getState = function(s) {
    return this.state;
};

gState = new game.StateManager();

//}());
