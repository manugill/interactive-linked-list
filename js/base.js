/* Definitions */
var n = []; // global container of all nodes
var nMax = 0;
var head = undefined;
var busy = false; // used to block operations

// Healths and notices
var health = {};
health.loops = [];
health.duplicate = [];
health.disconnected = [];
var notice = {};
notice.loops = false;
notice.duplicates = false;
notice.disconnected = false;

// Speed timeouts
var timeout = {};
// Normal speed
timeout.long = 1500;
timeout.medium = 1000;
timeout.short = 500;
timeout.notification = 4000;
timeout.disableNotifications = false;

/*// Fast speed
timeout.long = 25;
timeout.medium = 10;
timeout.short = 10;
timeout.notification = 4000;
timeout.disableNotifications = true;
*/

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
	class: 'rect'
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


/* Code elements */
var code = $('#code');
var codeEl = $('#code code')[0];


/* Snap svg setup */
var $editor = $('#editor');
var editorEl = $editor[0];
var s = Snap(editorEl);

// Editor bounds, screen size and offsets
bound = {};
bound.top = 0;
bound.left = 168;
bound.bottom = 0;
bound.right = 0;

function calculateSizes() {
	screenWidth = $(window).width();
	screenHeight = $(window).height();

	offset = {};
	offset.top = $editor.offset().top;
	offset.left = $editor.offset().left;
	offset.bottom = screenHeight - (offset.top + $editor.outerHeight());
	offset.right = screenWidth - (offset.left + $editor.outerWidth());
	offset.limitRight = screenWidth - (offset.right + offset.left);
	offset.limitBottom = screenHeight - offset.bottom;
}
calculateSizes();

$(window).resize(function() {
	calculateSizes();
});


function base() {
	this.nodes = s.group({
		id: 'nodes'
	});
	this.pointers = s.group({
		id: 'pointers'
	});
}

var base = new base();