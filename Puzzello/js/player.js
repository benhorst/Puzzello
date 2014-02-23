(function () {
    'use strict';
    function Player() {
        this.color = "blue";
        this.hand = null;

        this.setHand = function(h) {
            Assert(this.hand == null, "Player Hand should not be modified");
            this.hand = h;
        }
    }

    window.Player = Player;
})();