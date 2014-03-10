(function () {
    function dce() {
        return document.createElement.call(document, Array.prototype.slice.call(arguments, 0));
    }
    function createWithClass(tag, className) {
        var el = dce(tag);
        el.className = className;
        return el;
    }

    function getById(str) {
        return document.getElementById(str);
    }

    function createEl(str) {
        return document.createElement(str);
    }

    function assert(condition, message) {
        if (!condition) {
//            console.warn(arguments.callee.caller);
            if (window.HardAsserts) {
                throw ("ASSERT: " + message);
            } else if (window.TestMode) {
                window.AssertCount++;
            } else {
                console.warn("ASSERT: " + message);
            }
        }
    }

    window.getById = getById;
    window.createEl = createEl;
    window.doc = window.document;
    window.dce = dce;
    window.createWithClass = createWithClass;
    window.Assert = assert;
})();