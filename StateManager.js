//(function() {

window.game = window.game || { };

game.StateManager = function() {
    this.states = {
        LOADING: 0,
        PREGAME: 1,
        INGAME: 2,
        BETWEENLEVELS: 3,
        END: 4
    };
    this.state = this.states.LOADING;
};

game.StateManager.prototype.setState = function(s) {
    this.state = s; //should be doing some checking here
};
game.StateManager.prototype.getState = function(s) {
    return this.state;
};

gState = new game.StateManager();

//}());
