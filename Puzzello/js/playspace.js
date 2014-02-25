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
        this.applyMove = function (move, updateoptions) {
            this.state.applyMove(move, {});
            this.moves.push(move);
            if (updateoptions && updateoptions == Playstate.applyMove.ForceUpdate) {
                this.updateView();
            }
        }

        this.applyCurrentMove = function () {
            this.applyMove(this.activeMove, this.applyMove.DeferUpdate);
            this.activeMove = null;
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
            this.state.data.forEach(function (row, y) {
                var rowEl = createWithClass("div", "row");
                row.forEach(function (item, x) {
                    var tileEl = createWithClass("div", "tile");
                    if (item instanceof Player) {
                        tileEl.style.background = item.color;
                        tileEl.textContent = "O";
                    } else {
                        tileEl.textContent = "";
                    }

                    // check if in the bounds of the current move
                    if (instance.activeMove) {
                        var colpos = x - instance.activeMove.position.col;
                        var rowpos = y - instance.activeMove.position.row;
                        if (rowpos >= 0 && instance.activeMove.card.data[rowpos]
                            && colpos >= 0 && instance.activeMove.card.data[rowpos][colpos]) {
                            // For now, straight up apply the move with no checking.
                            if (instance.activeMove.card.data[rowpos][colpos] === MoveCard.TileEnum.add) {
                                tileEl.style.background = instance.activeMove.player.color;
                                tileEl.textContent = "O";
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
            commitMoveButton.addEventListener('click', function () {
                instance.applyCurrentMove();
            }, false);
            commitMoveButton.value = "Commit Move";


            var movecontainer = createWithClass("div", "play-arrowbuttons");
            var leftmoveButton = createWithClass("input", "play-leftarrow");
            leftmoveButton.setAttribute("type", "button");
            leftmoveButton.addEventListener('click', function () {
                if (!instance.activeMove) return;
                instance.activeMove.position.col--;
                instance.activeMove.position.col = Math.max(instance.activeMove.position.col, 0);
                instance.updateView()
            }, false);
            leftmoveButton.value = " < ";

            var rightmoveButton = createWithClass("input", "play-rightarrow");
            rightmoveButton.setAttribute("type", "button");
            rightmoveButton.addEventListener('click', function () {
                if (!instance.activeMove) return;
                instance.activeMove.position.col++;
                instance.activeMove.position.col = Math.min(instance.activeMove.position.col, instance.state.data[0].length - instance.activeMove.card.data[0].length);
                instance.updateView();
            }, false);
            rightmoveButton.value = " > ";

            var upmoveButton = createWithClass("input", "play-uparrow");
            upmoveButton.setAttribute("type", "button");
            upmoveButton.addEventListener('click', function () {
                if (!instance.activeMove) return;
                instance.activeMove.position.row--;
                instance.activeMove.position.row = Math.max(instance.activeMove.position.row, 0);
                instance.updateView()
            }, false);
            upmoveButton.value = " ^ ";

            var downmoveButton = createWithClass("input", "play-downarrow");
            downmoveButton.setAttribute("type", "button");
            downmoveButton.addEventListener('click', function () {
                if (!instance.activeMove) return;
                instance.activeMove.position.row++;
                instance.activeMove.position.row = Math.min(instance.activeMove.position.row, instance.state.data.length-instance.activeMove.card.data.length);
                instance.updateView()
            }, false);
            downmoveButton.value = " v ";

            movecontainer.appendChild(leftmoveButton);
            movecontainer.appendChild(rightmoveButton);
            movecontainer.appendChild(upmoveButton);
            movecontainer.appendChild(downmoveButton);

            container.appendChild(cancelButton);
            container.appendChild(commitMoveButton);
            container.appendChild(movecontainer);

            return container;
        }

        this.cancelActiveMove = function () {
            this.activeMove = null;
            this.updateView();
        }

        this.handleTileClick = function (ev, x, y) {
            if (this.state == 'aiming a card') {
                // TODO - make this a work item as soon as possible or/and remove dead code.
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

    Playstate.applyMove = { ForceUpdate: "update", DeferUpdate: "defer" };

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
            // don't apply moves that don't exist.
            if (!move) return;

            var newState = this.copy();
            var instance = this;
            move.card.data.forEach(function(cardRow, cardY) {
                let stateY = move.position.row + cardY;
                // if newState row is within the bounds of the state, check columns
                if(stateY < newState.data.length) {
                    cardRow.forEach(function(cardCol, cardX) {
                        let stateX = move.position.col + cardX;
                        // if newState col is within the bounds of the state, assign
                        if (cardX < newState.data[0].length) {
                            try {
                                newState.data[stateY][stateX] = Playstate.applySingleTileMove(newState.data[stateY][stateX], move.card.data[cardY][cardX], move);
                            } catch (ex) {
                                if (ex instanceof InvalidMoveError) {
                                    LogMessage("Invalid Move. " + ex.reason + " Please try again.");
                                    return instance;
                                } else {
                                    // rethrow the exception, this was not expected.
                                    throw (ex);
                                }
                            }
                        }
                    });
                }
            });
            return newState;
        }

        this.copy = function () {
            var state = new Playstate();
            state.data = this.data.map(function (row) { return row.slice(0); }); // copy the only member. ensure deep copy.
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
                    throw (new InvalidMoveError(InvalidMoveError.Codes.NothingToRemove, "A [Remove] tile must be placed on an existing token"));
                }
                result = MoveCard.TileEnum.empty;
                break;
            case MoveCard.TileEnum.require:
                // if(this.data != player) throw InvalidMoveError must be current player's tile
                break;
            case MoveCard.TileEnum.multiply:
                // todo: check if valid, do something more than add a plain marker
                if (current == MoveCard.TileEnum.empty) {
                    throw(new Error(""))
                }
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