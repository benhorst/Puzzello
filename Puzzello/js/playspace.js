(function () {
    'use strict';
    function Playspace() {
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
            this.updateView();
        }

        // place a possible move in the active slot (show to players, allow to confirm)
        this.setActiveMove = function (player, card) {
            this.activeMove = new Move(player, card, new RowCol(0, 0));
            this.updateView();
        }

        this.updateView = function () {
            this.htmlNode.refresh();
        }

        // honestly I'm not sure if this is useful
        this.speculateApplyMove = function (move) {
            return this.state.copy().applyMove(move);
        }

        this.constructHtml = function () {
            var container = createWithClass("div", "playspace");
            var instance = this;
            // todo: check for active move and set the move as some sort of overlay class that displays the outcome
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

                    // check if in the bounds of the current move
                    if (instance.activeMove) {
                        var colpos = x - instance.activeMove.position.col;  // TODO: this is flipped somehow. bad. colums are rows or soemthing.
                        var rowpos = y - instance.activeMove.position.row;
                        if (rowpos >= 0 && instance.activeMove.card.data[rowpos]
                            && colpos >= 0 && instance.activeMove.card.data[rowpos][colpos]) {
                            // For now, straight up apply the move with no checking.
                            if (instance.activeMove.card.data[rowpos][colpos] === MoveCard.TileEnum.add) {
                                tileEl.style.background = instance.activeMove.player.color;
                                tileEl.textContent = "X";
                            } else if (instance.activeMove.card.data[rowpos][colpos] === MoveCard.TileEnum.remove) {
                                tileEl.style.background = "none";
                                tileEl.textContent = "";
                            }
                        }
                    }

                    rowEl.addEventListener('click', tileClickHandler(instance, x, y), false);
                    rowEl.appendChild(tileEl);
                });
                container.appendChild(rowEl);
            });

            // make required UI with buttons for cancel/commit actions (should be temporary)
            // eventually, this UI interaction will be more intuitive, but we'll use some clunky UI to prototype
            var cancelButton = createWithClass("input", "play-cancel");
            cancelButton.setAttribute("type", "button");
            cancelButton.addEventListener('click', function () { instance.cancelActiveMove(); }, false);
            cancelButton.value = "Cancel Move";

            var commitMoveButton = createWithClass("input", "play-commit");
            commitMoveButton.setAttribute("type", "button");
            commitMoveButton.addEventListener('click', function () { instance.applyMove(instance.activeMove); }, false);
            commitMoveButton.value = "Commit Move";

            container.appendChild(cancelButton);
            container.appendChild(commitMoveButton);

            return container;
        }

        this.cancelActiveMove = function () {
            this.activeMove = null;
            this.updateView();
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

        this.cancelActiveMove = function () {
            this.activeMove = null;
            this.updateView();
        }

        function tileClickHandler(playspace, x, y) {
            return function (ev) {
                playspace.handleTileClick(ev, x, y);
            }

        }

        this.moves = [];
        this.state = new Playstate();
        this.activeMove = null;
        this.htmlNode = new HtmlNodeManager(this, this.constructHtml);
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

                    this.data[x][y] = Playstate.applySingleTileMove(this.data[x][y], move.card.data[i][j], move);
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
    Playstate.applySingleTileMove = function (current, applied, move) {
        var result = current;
        switch (applied) {
            case MoveCard.TileEnum.add:
                // todo: check if valid -- can "add" requests overwrite currently filled tiles?
                result = move.player;
                break;
            case MoveCard.TileEnum.remove:
                // if(data != player) throw InvalidMoveError cannot remove on anything other than the player's tile
                if (current == MoveCard.TileEnum.empty) {
                    throw (new Error("Invalid Move: cannot place a tile here"));
                }
                result = MoveCard.TileEnum.empty;
                break;
            case MoveCard.TileEnum.require:
                // if(this.data != player) throw InvalidMoveError must be current player's tile
                break;
            case MoveCard.TileEnum.multiply:
                // todo: check if valid, do something more than add a plain marker
                current = move.player;
                break;
            case MoveCard.TileEnum.empty:
                break;
            default:
                throw (new Error("unrecognized MoveCard action"));
                break;
        }
        return result;
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