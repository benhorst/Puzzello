(function () {
    'use strict';

    window.TestMode = true;
    addEventListener('load', function () {
        reset();
        runTests();
    });

    // definitions...

    function reset() {
        window.AssertCount = 0;
        window.HardAsserts = false;
    }

    function tassert(condition, message) {
        if (!condition) {
            var fail = dce('div');
            fail.textContent = "FAILED TEST: " + message;
            document.body.appendChild(fail);
        }
    }

    function footest() {
        this.construct = function () {  }
    }

    // main test running function. encapsulate to make commenting out easy up top.
    function runTests() {
        // tests for html constructing class
        var nodeman = new HtmlNodeManager();
        tassert(AssertCount == 2, "HtmlNodeManager should assert if not given parent or construct function");
        reset();
        var foo = new footest();
        nodeman = new HtmlNodeManager(foo, foo.construct);
        tassert(AssertCount == 0, "HtmlNodeManager should not assert if given parameters");
        tassert(nodeman.isDirty === false, "HtmlNodeManager should have property 'isdirty' set to false");
        tassert(!nodeman.dirty, "HtmlNodeManager should not expose internal field 'dirty'");
        tassert(!nodeman.node, "HtmlNodeManager should not expose internal field 'node'");
        tassert(!nodeman.owner, "HtmlNodeManager should not expose internal field 'owner'");

    }

})();