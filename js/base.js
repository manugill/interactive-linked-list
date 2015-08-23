/* Definitions */
var n = []; // global container of all nodes
var head = undefined;

// Defaults
var def = {};

def.nodeWidth = 110;
def.nodeHeight = 55;

def.attrGroup = {
	transform: 't0,0'
};
def.attrRect = {
	class: 'rect'
};
def.attrCircle = {
	class: 'circle'
};
def.attrPointer = {
	class: 'pointer'
};

// Snap svg setup
var svg = $('.editor')[0];
var s = Snap(svg);