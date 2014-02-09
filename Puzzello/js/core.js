
function htmlNodeManager(owner, constructfunc) {
    var node = null;
    var dirty = false;
    var owner = owner;
    var constructFunc = constructfunc;
    Assert(constructFunc, "There must be a construct function set.");
    Assert(owner, "There must be a owner set.");
    
    Object.defineProperty(this, 'isDirty', { get: getDirty, configurable:false });
    Object.defineProperty(this, 'node', { get: getNode, configurable:false });
    Object.defineProperty(this, 'construct', { value: construct, writeable: false, configurable: false });

    function getNode() {
        if (!node || dirty) {
            construct();
            dirty = false;
        }
        return node;
    }

    function getDirty() {
        return dirty;
    }

    function construct() {
        node = constructFunc.call(owner);
    }

    if(owner) owner.getHtmlNode = getNode;
}
    
function RowCol(row, col) {
    this.row = row;
    this.col = col;
}

window.RowCol = RowCol;
window.HtmlNodeManager = htmlNodeManager;