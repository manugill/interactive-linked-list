/* Definitions */
var n = []; // global container of all nodes
var head = undefined;
var current = undefined; // container for any node with actions being performed
var nMax = 0;

// Defaults
var def = {};

def.nodeWidth = 110;
def.nodeHeight = 55;

def.attrGroup = {
	transform: 't0,0'
};
def.attrNode = {
	transform: 't0,0',
	class: 'node'
};
def.attrRect = {
	//class: 'rect'
};
def.attrText = {
	//class: 'text'
}
def.attrCircle = {
	class: 'circle'
};
def.attrPointer = {
	class: 'pointer',
	'marker-end': 'url(#triangle)'
};

/* Snap svg setup */
var svg = $('.editor')[0];
var s = Snap(svg);

function base() {
	this.pointers = s.group();
	this.nodes = s.group();
}

var base = new base();