(function() {
    'use strict';
    function Hand(cards, player, playspace) {
        let instance = this;
        this.cards = cards || [];
        this.player = player || null;
        this.playspace = playspace || null;

        this.htmlNode = new HtmlNodeManager(this, constructHtml);
        if (this.player) this.player.setHand(this);
        cards.forEach(function (c) { c.hand = instance; });

        this.notifyCardClick = function (card) {
            if (playspace) {
                playspace.setActiveMove(this.player, card);
            } else {
                console.warn("handInstance.notifyCardClick: a card has been clicked, but the hand has no playspace.")
                console.warn(hand);
            }
        }

        function constructHtml() {
            var container = createWithClass("div", "hand");
            this.cards.forEach(function (card) {
                container.appendChild(card.getHtmlNode());
            });
            return container;
        }
    }

    window.Hand = Hand;
})();