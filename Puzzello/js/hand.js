(function() {
    'use strict';
    function Hand(cards, player, playspace) {
        this.cards = cards || [];
        this.player = player || null;
        this.playspace = playspace || null;

        this.htmlNode = new HtmlNodeManager(this, constructHtml);


        this.notifyCardClick = function (card) {
            if (playspace) {
                playspace.setMove(card, Playspace.CardMoves.prospective);
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