
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
    Object.defineProperty(this, 'refresh', { value: refresh, writeable: false, configurable: false });

    function getNode() {
        if (!node || dirty) {
            construct();
            dirty = false;
        }
        return node;
    }

    function refresh() {
        dirty = true;
        construct();
    }

    function getDirty() {
        return dirty;
    }

    function construct() {
        let tempNode = constructFunc.call(owner);
        if (node) {
            // once the construction has succeeded, remove the old node.
            node.parentNode.insertBefore(tempNode, node);
            node.parentNode.removeChild(node);
        }
        node = tempNode;
        dirty = false;
    }

    if(owner) owner.getHtmlNode = getNode;
}
    
function RowCol(row, col) {
    this.row = row;
    this.col = col;
}

window.RowCol = RowCol;
window.HtmlNodeManager = htmlNodeManager;