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
notice.disconnected = false;
notice.noSpace = false;

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
	class: 'animated'
};
def.attrPointerVisible = {
	class: 'pointer'
};
def.attrPointerInvisible = {
	class: 'pointer-invisible'
};


/* Snap svg setup */
var $editor = $('#editor');
var editorEl = $editor[0];
var s = Snap(editorEl);

var base = {};
base.nodes = s.group({
	id: 'nodes'
});
base.pointers = s.group({
	id: 'pointers'
});



/* UI elements */
var $header = $('#header');
var $options = $('#options');
var $code = $('#code');
var codeEl = $('#code code')[0];

// Editor bounds, screen size and offsets
var bound = {};
var offset = {};
var screenWidth;
var screenHeight;

function calculateSizes() {
	var screenWidth = $(window).width();
	var screenHeight = $(window).height();

	bound.top = $header.outerHeight() + 53;
	bound.left = $options.outerWidth() + 5;
	bound.bottom = 20;
	bound.right = $code.outerWidth() + 5;

	offset.top = $editor.offset().top;
	offset.left = $editor.offset().left;
	offset.bottom = screenHeight - (offset.top + $editor.outerHeight());
	offset.right = screenWidth - (offset.left + $editor.outerWidth());
	offset.limitRight = screenWidth - (offset.right + offset.left) - bound.right;
	offset.limitBottom = screenHeight - offset.bottom - bound.bottom;
}
calculateSizes();

$(window).resize(function() {
	calculateSizes();
});


/* Default settings and changes */
var showNotifications = true;
var speed = {normal: 1500, short: 500, updateLine: 300};

$('#settings-toggle').click(function () {
	$('#settings').toggle();
	$(this).find('i').toggleClass('ion-ios-arrow-up');
});

$('#notification-switch').change(function () {
	if ( $(this).is(":checked") )
		showNotifications = true;
	else
		showNotifications = false;
});

$('#speed-slider').on('change.fndtn.slider', function() {
	$('body').removeClass('animations-fast animations-slow');

	var value = $('#speed-value').val();
	if ( value == 1 ) {
		speed = {normal: 3000, short: 1500, updateLine: 500};
		$('body').addClass('animations-slow');
	} else if ( value == 3 ) {
		speed = {normal: 100, short: 60, updateLine: 50};

		$('body').addClass('animations-fast');
		$('#notification-switch').removeAttr('checked').change();
	} else {
		speed = {normal: 1500, short: 500, updateLine: 300};
	}
});



// Joyride setup
$(document).foundation({
	joyride: {
		cookie_monster: true,
		tip_animation_fade_speed : 200
	}
});
$(document).foundation('joyride', 'start');