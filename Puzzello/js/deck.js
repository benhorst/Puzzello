(function () {
    'use strict';

    function Deck() {
        this.hand = null;
        this.cards = [];

        this.setCards = function (arrayOfCards) {
            Assert(arrayOfCards instanceof Array, "Deck.setCards: the arrayOfCards provided is not an array: " + arrayOfCards);
            arrayOfCards.forEach(function (card, index) { Assert(card instanceof MoveCard, "Deck.setCards: card provided at index " + index + " is not a MoveCard: " + card); });

            this.cards = arrayOfCards;
        }

        this.setCardsWithData = function (arrayOfCards) {
            Assert(arrayOfCards instanceof Array, "Deck.setCards: the arrayOfCards provided is not an array: " + arrayOfCards);
            arrayOfCards.forEach(function (card, index) { Assert(card instanceof Array, "Deck.setCards: card provided at index " + index + " is not an array: " + card); });

            this.cards = arrayOfCards.map(function (card) { return MoveCard.createWithData(card); });
        }

        this.drawCard = function () {
            if (cards.length < 1) {
                LogMessage("Deck ran out of cards.");
                return null;
            } else {
                return this.cards.pop();
            }
        }
    }

    window.Deck = Deck;
})();