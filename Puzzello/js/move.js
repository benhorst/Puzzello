(function () {
    'use strict';
    function Move(player, card, position) {
        this.player = player;
        this.card = card;
        this.position = position;

    }

    // a class to represent a move card owned/held by a player
    function MoveCard() {
        this.setData = function (data) {
            // TODO: validate and stuff. possibly remove/replace htmlnode
            this.data = data;
            dirty = true;
            Assert(!!this.data, "must have data set on a MoveCard");
        }

        // to make the html
        this.toHtml = function () {
            var container = createWithClass("div", "move-card");

            var instance = this;
            this.data.forEach(function (row) {
                var rowEl = createWithClass("div", "row-container");
                row.forEach(function (tile) {
                    var tileEl = createWithClass("div", "tile");
                    tileEl.textContent = tile;
                    rowEl.appendChild(tileEl);
                });
                container.appendChild(rowEl);
            });

            return container;
        }

        this.data = MoveCard.DefaultTileData;
        this.hand = null;
        var htmlNode = new HtmlNodeManager(this, this.toHtml);
        var dirty = false;

        this.toString = function () {
            return "MoveCard: " +
                "\n  data: " + this.data +
                "\n  hand: " + this.hand +
                "\n  htmlNode: " + htmlNode.node +
                "\n  dirty: " + dirty;
        }
    }
    MoveCard.onclick = function (card) {
        return function (ev) {
            if (card.hand) {
                card.hand.notifyCardClick(card);
            }
            else {
                console.warn("MoveCard.onclick: a card with no hand has been clicked");
                console.warn("" + card);
            }
        };
    }
    MoveCard.TileEnum = {
        remove: "x",
        add: "o",
        require: "O",
        multiply: "m",
        empty: "",
    };
    MoveCard.GetTileClass = function (en) {
        Assert(en instanceof MoveCard.TileEnum, "MoveCard.GetTileClass: input is not a MoveCard.TileEnum");
        return "move-" + en;
    }
    // return an empty array by default (need new instance)
    Object.defineProperty(MoveCard, "DefaultTileData", { get: function () { return [["O"]] } });
    MoveCard.createWithData = function (data) { var r = new MoveCard(); r.setData(data); return r; };


    window.Move = Move;
    window.MoveCard = MoveCard;
})();