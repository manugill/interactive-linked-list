/* Definitions */
var n = []; // global container of all nodes
var nMax = 0;
var current = undefined; // container for any node with actions being performed
var head = undefined;
var busy = false; // used to block operations

var health = {};
health.loops = [];
health.duplicate = [];
var notice = {};
notice.loops = false;
notice.duplicates = false;

// Defaults
var def = {};

def.nodeWidth = 112;
def.nodeHeight = 56;
def.nodeSpace = 2;

def.attrGroup = {
	transform: 't0,0'
};
def.attrNode = {
	transform: 't0,0',
	class: 'node'
};
def.attrNodeInner = {
	class: 'inner animated'
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
	class: 'pointer animated'
};

/* Snap svg setup */
var svg = $('.editor')[0];
var s = Snap(svg);

function base() {
	this.pointers = s.group({
		id: 'pointers'
	});
	this.nodes = s.group({
		id: 'nodes'
	});
}

var base = new base();