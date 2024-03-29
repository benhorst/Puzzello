﻿// For an introduction to the Blank template, see the following documentation:
// http://go.microsoft.com/fwlink/?LinkId=232509
(function () {
    "use strict";

    var app = WinJS.Application;
    var activation = Windows.ApplicationModel.Activation;

    app.onactivated = function (args) {
        if (args.detail.kind === activation.ActivationKind.launch) {
            if (args.detail.previousExecutionState !== activation.ApplicationExecutionState.terminated) {
                // TODO: This application has been newly launched. Initialize
                // your application here.
                initialize();
            } else {
                // TODO: This application has been reactivated from suspension.
                // Restore application state here.
                app.launch();
            }
            args.setPromise(WinJS.UI.processAll());
        }
    };

    app.oncheckpoint = function (args) {
        // TODO: This application is about to be suspended. Save any state
        // that needs to persist across suspensions here. You might use the
        // WinJS.Application.sessionState object, which is automatically
        // saved and restored across suspension. If you need to complete an
        // asynchronous operation before your application is suspended, call
        // args.setPromise().
    };

    app.start();

    function initialize() {
        var player = new Player();
        var playspace = Playspace.newGame(player);
        getById("play-container").appendChild(playspace.getHtmlNode());

        LogMessage("Created a board...");

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

            [[mte.empty, mte.empty, mte.add],
              [mte.empty, mte.add, mte.empty],
              [mte.add, mte.empty, mte.empty]],

            // add a few single column/row cards
            [[mte.add, mte.remove, mte.add]],
            [[mte.remove, mte.add, mte.remove]],
            [[mte.remove], [mte.add], [mte.remove]],
            [[mte.add], [mte.remove], [mte.add]],

            // diagonals
            [[mte.remove, mte.add],
                [mte.add, mte.remove]],
            [[mte.add, mte.remove],
                [mte.remove, mte.add]],

            // corners
            [[mte.remove, mte.add],
                [mte.add, mte.add]],
            [[mte.add, mte.add],
                [mte.remove, mte.add]],
            [[mte.add, mte.remove],
                [mte.add, mte.add]],
            [[mte.add, mte.add],
                [mte.add, mte.remove]]
        ].map(
            MoveCard.createWithData
        );

        var hand = new Hand(cards, player, playspace);

        cards.forEach(function (card) {
            card.getHtmlNode().addEventListener('click', MoveCard.onclick(card), false);
        });
        LogMessage("generated some cards...");

        getById("hand-container").appendChild(hand.getHtmlNode());  
    }
})();
