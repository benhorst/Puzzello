
addEventListener('load', function () {
    var mte = MoveCard.TileEnum;
    var cards = [
        [[mte.empty, mte.empty, mte.empty],
          [mte.add, mte.remove, mte.add],
          [mte.empty, mte.empty, mte.empty]],

        [[mte.add, mte.empty, mte.empty],
          [mte.empty, mte.remove, mte.empty],
          [mte.empty, mte.empty, mte.add]],

        [[mte.empty, mte.add, mte.empty],
          [mte.empty, mte.remove, mte.empty],
          [mte.empty, mte.add, mte.empty]],

        [[mte.empty, mte.empty, mte.add],
          [mte.empty, mte.remove, mte.empty],
          [mte.add, mte.empty, mte.empty]],
    ].map(MoveCard.createWithData);
    cards.forEach(function (card) {
        document.body.appendChild(card.toHtml());
    });

    var player = new Player();

    var pspace = Playspace.newGame(player);
    document.body.appendChild(pspace.constructHtml());

    var move = new Move(player, cards[0], new XY(0, 0));
    pspace.applyMove(move);

    document.body.appendChild(pspace.constructHtml());

    move = new Move(player, cards[3], new XY(1, 2));
    pspace.applyMove(move);

    document.body.appendChild(pspace.constructHtml());
}, false);