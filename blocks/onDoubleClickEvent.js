var clicksCount = 0;
var timerID = null;
var currentBlock = null;

function onDoubleClickEvent(block) {
    var next = block.getNextBlock();
    if (next === null) return;
    var parent = block.getParent();
    if (parent === null) return;

    var parentConnection = block.previousConnection.targetConnection;

    block.previousConnection.disconnectInternal_(parent, block);
    block.nextConnection.disconnectInternal_(block, next);
    next.previousConnection.connect(parentConnection);

    var dx = Math.floor(Math.random() * 100) - 50;
    var dy = Math.floor(Math.random() * 50) - 25;
    block.moveBy(200 + dx, 50 + dy);
}

function computeClicks() {
    if (clicksCount == 2) {
        onDoubleClickEvent(currentBlock);
    }
    clicksCount = 0;
}

function onEventCheckName(event) {
    if (event.type == Blockly.Events.UI && event.element == 'click') {
        if (timerID !== null) clearTimeout(timerID);
        var block = Blockly.getMainWorkspace().getBlockById(event.blockId);
        if (block) {
            clicksCount++;
            currentBlock = block;
            timerID = setTimeout(computeClicks, 300);
        }
    }
}
