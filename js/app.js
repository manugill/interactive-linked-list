// Snap h
var move = function(dx,dy) {
    this.attr({
        transform: this.data('origTransform') + (this.data('origTransform') ? "T" : "t") + [dx, dy]
    });
}

var start = function() {
    this.data('origTransform', this.transform().local );
}
var stop = function() {
    console.log('finished dragging');
}
var moved = function() {
    console.log('finished dragging');
}


/* Object definitions */
nodeAttr = {
    transform: 't0,0'
};
rectAttr = {
    class: 'rect'
};
pointerAttr = {
    class: 'pointer'
};
dividerAttr = {
    class: 'divider'
};

var nodeWidth = 110;
var nodeHeight = 55;


/* Stuff */
var svg = $('#editor')[0];
var s = Snap(svg);


var nodes = [];

// Create node
function createNode() {
    var node = s.group(nodeAttr);
    node.prev = undefined;
    node.next = undefined;

    console.log(node);

    node.rect = s.rect(0, 0, nodeWidth, nodeHeight);
    node.rect.attr(rectAttr);
    node.rect.appendTo(node);
    node.rect.getParent = node;

    node.divider = s.line(nodeWidth/2, 0, nodeWidth/2, nodeHeight);
    node.divider.attr(dividerAttr);
    node.divider.appendTo(node);

    node.pointer = s.line();
    node.pointer.attr(pointerAttr);

    return node;
}
function updateLine(node, x2, y2) {
    node.pointer.attr({
        x1: node.matrix.e + nodeWidth - nodeWidth/4,
        y1: node.matrix.f + nodeHeight - nodeHeight/2,
        x2: x2,
        y2: y2
    });
}

var node = createNode();
updateLine(node);

node.drag(function(dx, dy, posX, posY, e) {
    var x = this.matrix.f;
    var y = this.matrix.e;

    if (y + nodeWidth/2 > posX) { // dragging on the left half the rectangle
        this.attr({
            transform: this.data('origTransform') + (this.data('origTransform') ? "T" : "t") + [dx, dy]
        });
    } else {
        updateLine(node, posX, posY);
    }

}, start, stop );