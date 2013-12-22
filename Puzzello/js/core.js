// a class to represent a move card owned/held by a player
function MoveCard() {
    this.data = MoveCard.DefaultTileData;
        
    this.toHtml = function() {
        var container = createWithClass("div", "move-card");
            
        this.data.forEach(function(row) {
            var rowEl = createWithClass("div", "row-container");
            row.forEach(function(tile) {
                var  tileEl= createWithClass("div", "tile");
                tileEl.textContent = tile;
                rowEl.appendChild(tileEl);
            });
            container.appendChild(rowEl);
        });
            
        return container;
    }
}
MoveCard.TileEnum = {
    remove: "x",
    add: "o",
    require: "O",
    multiply: "m",
    empty: "",
};
// return an empty array by default (need new instance)
Object.defineProperty(MoveCard, "DefaultTileData", {get: function () { return [ [ "O" ] ] } });
MoveCard.createWithData = function(data) { var r = new MoveCard(); r.data = data; return r; };
    
function Playspace() {
    this.moves = [];
    this.state = new Playstate();
        
    this.computeCurrentState = function(playstate) {
        var playstate = playstate || new Playstate();
        this.moves.forEach(function(move) {
            playstate.apply(move);
        });
        return playstate;
    }
        
    this.applyMove = function(move) {
        this.state.applyMove(move, {});
        this.moves.push(move);
    }
        
    this.speculateApplyMove = function(move) {
        return this.state.copy().applyMove(move);
    }
        
    this.constructHtml = function() {
        var container = createWithClass("div", "playspace");
            
        this.state.data.forEach(function(row, x) {
            var rowEl = createWithClass("div", "row");
            row.forEach(function(item, y) {
                var tileEl = createWithClass("div", "tile");
                if(item instanceof Player) {
                    tileEl.style.background = item.color;
                    tileEl.textContent = "X";
                } else {
                    tileEl.textContent = "";
                }
                rowEl.appendChild(tileEl);
            });
            container.appendChild(rowEl);
        });
        return container;
    }
}
    
Playspace.newGame = function(player) {
    var ps = new Playspace();
    var pstate = new Playstate();
    pstate.data = Playstate.initialGameState(player);
    ps.state = pstate;
    return ps;
}
    
function Playstate() {
    this.data = Playstate.fiveByFiveEmpty();
        
    this.applyMove = function(move, options) {
        for(var i = 0; i < move.card.data.length; i++) {
            var x = i + move.position.x;
            if(x < 0 || x >= this.data.length) continue;
            for(var j = 0; j < move.card.data[i].length; j++) {
                var y = j + move.position.y;
                if(y < 0 || y >= this.data[i].length) continue;
                switch(move.card.data[i][j]) {
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
                        throw(new Error("unrecognized MoveCard action"));
                        break;
                }
            }
        }
        return this;
    }
        
    this.copy = function() {
        var state = new Playstate();
        state.data = this.data.slice(0); // copy the only member
        return state;
    }
}
// return a new instance of a 5x5 empty array
Playstate.fiveByFiveEmpty = function () {
    return [
        [ 0, 0, 0, 0, 0],
        [ 0, 0, 0, 0, 0],
        [ 0, 0, 0, 0, 0],
        [ 0, 0, 0, 0, 0],
        [ 0, 0, 0, 0, 0],
    ];
};
Playstate.initialGameState = function (player) {
    return [
        [ 0, 0, 0, 0, 0],
        [ 0, 0, 0, 0, 0],
        [ 0, 0, player, 0, 0],
        [ 0, 0, 0, 0, 0],
        [ 0, 0, 0, 0, 0],
    ];
};
    
function Player() {
    this.color = "blue";
}
    
function Move(player, card, position) {
    this.player = player;
    this.card = card;
    this.position = position;
}
    
function XY(x, y) {
    this.x = x;
    this.y = y;
}
    
    
function dce() {
    return document.createElement.call(document, Array.prototype.slice.call(arguments, 0));
}
function createWithClass(tag, className) {
    var el = dce(tag);
    el.className = className;
    return el;
}
    
window.MoveCard = MoveCard;
window.Player = Player;
window.Move = Move;
window.XY = XY;
window.Playspace = Playspace;
    