(function () {
    'use strict';
    function Playspace() {
        this.moves = [];
        this.state = new Playstate();
        this.activeMove = null;

        this.computeCurrentState = function (playstate) {
            var playstate = playstate || new Playstate();
            this.moves.forEach(function (move) {
                playstate.apply(move);
            });
            return playstate;
        }

        // take a move and apply it to the committed moves
        this.applyMove = function (move) {
            this.state.applyMove(move, {});
            this.moves.push(move);
        }

        // place a possible move in the active slot (show to players, allow to confirm)
        this.setActiveMove = function (card) {
            this.activeMove = card;
        }

        this.updateView = function () {

        }

        this.speculateApplyMove = function (move) {
            return this.state.copy().applyMove(move);
        }

        this.constructHtml = function () {
            var container = createWithClass("div", "playspace");

            this.state.data.forEach(function (row, x) {
                var rowEl = createWithClass("div", "row");
                row.forEach(function (item, y) {
                    var tileEl = createWithClass("div", "tile");
                    if (item instanceof Player) {
                        tileEl.style.background = item.color;
                        tileEl.textContent = "X";
                    } else {
                        tileEl.textContent = "";
                    }
                    rowEl.addEventListener('click', tileClickHandler(this, x, y), false);
                    rowEl.appendChild(tileEl);
                });
                container.appendChild(rowEl);
            });
            return container;
        }

        this.handleTileClick = function (ev, x, y) {
            if (this.state == 'aiming a card') { // TODO
                //generate speculative state
                //generate the html including that move
                //insert the temp html (letting click events pass through to here?)

            } else {
                // do nothing...
            }
        }

        function tileClickHandler(playspace, x, y) {
            return function (ev) {
                playspace.handleTileClick(ev, x, y);
            }

        }
    }

    Playspace.newGame = function (player) {
        var ps = new Playspace();
        var pstate = new Playstate();
        pstate.data = Playstate.initialGameState(player);
        ps.state = pstate;
        return ps;
    }

    function Playstate() {
        this.data = Playstate.fiveByFiveEmpty();

        this.applyMove = function (move, options) {
            for (var i = 0; i < move.card.data.length; i++) {
                var x = i + move.position.col;
                if (x < 0 || x >= this.data.length) continue;
                for (var j = 0; j < move.card.data[i].length; j++) {
                    var y = j + move.position.row;
                    if (y < 0 || y >= this.data[i].length) continue;
                    switch (move.card.data[i][j]) {
                        case MoveCard.TileEnum.add:
                            // todo: check if valid -- can "add" requests overwrite currently filled tiles?
                            this.data[x][y] = move.player;
                            break;
                        case MoveCard.TileEnum.remove:
                            // if(data != player) throw InvalidMoveError cannot remove on anything other than the player's tile
                            this.data[x][y] = 0;
                            break;
                        case MoveCard.TileEnum.require:
                            // if(this.data != player) throw InvalidMoveError must be current player's tile
                            break;
                        case MoveCard.TileEnum.multiply:
                            // todo: check if valid, do something more than add a plain marker
                            this.data[x][y] = move.player;
                            break;
                        case MoveCard.TileEnum.empty:
                            break;
                        default:
                            throw (new Error("unrecognized MoveCard action"));
                            break;
                    }
                }
            }
            return this;
        }

        this.copy = function () {
            var state = new Playstate();
            state.data = this.data.slice(0); // copy the only member
            return state;
        }
    }
    // return a new instance of a 5x5 empty array
    Playstate.fiveByFiveEmpty = function () {
        return [
            [0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0],
        ];
    };
    Playstate.initialGameState = function (player) {
        return [
            [0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0],
            [0, 0, player, 0, 0],
            [0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0],
        ];
    };

    // Raise values to global scope
    window.Playspace = Playspace;
    window.Playstate = Playstate;
})();