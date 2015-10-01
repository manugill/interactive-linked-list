/**
 * Helpers
 */

/* IsEmpty checker */
// http://stackoverflow.com/questions/4994201/is-object-empty
var hasOwnProperty = Object.prototype.hasOwnProperty;
function isEmpty(obj) {
	// null and undefined are "empty"
	if (obj == null || obj == undefined) return true;

	// Assume if it has a length property with a non-zero value
	// that that property is correct.
	if (obj.length && obj.length > 0)   return false;
	if (obj.length === 0)  return true;

	// Otherwise, does it have any properties of its own?
	// Note that this doesn't handle
	// toString and toValue enumeration bugs in IE < 9
	for (var key in obj)
		if (hasOwnProperty.call(obj, key))
			return false;

	return true;
}

/* Timeout Chain */
// http://stackoverflow.com/questions/6921275/is-it-possible-to-chain-settimeout-functions-in-javascript
function TimeoutChain() {
	var This = this;
	this._timeoutHandler = null;
	this.chain = new Array();
	this.currentStep = 0;
	this.isRunning = false;

	this.nextStep = function() {
		This.currentStep = This.currentStep +1;
		if (This.currentStep == This.chain.length)
			This.stop();
		else
			This.processCurrentStep();
	};
	this.processCurrentStep = function() {
		This._timeoutHandler = window.setTimeout(function() {
			This.chain[This.currentStep].func();
			This.nextStep();
		}, This.chain[This.currentStep].time);
	};
	this.start =function() {
		if (This.chain.length == 0 || This.isRunning == true)
			return;

		This.isRunning = true;
		This.currentStep = 0;
		This.processCurrentStep();
	};
	this.stop = function() {
		This.isRunning = false;
		window.clearTimeout(This._timeoutHandler)
	};
	this.add = function(_timeout, _function) {
		This.chain[This.chain.length] = {time: _timeout, func: _function};
	};
}


/* Geometry */
// Generate a loc object with start matrix of a node
function nodeLoc(matrix) {
	loc = {};
	loc.x = matrix.e;
	loc.y = matrix.f;

	loc.end = {}; // the bottom right point
	loc.end.x = loc.x + def.nodeWidth/2 + def.nodeSpace;
	loc.end.y = loc.y + def.nodeHeight/2;

	loc.start = {}; // the top left point
	loc.start.x = loc.x - def.nodeWidth/2 - def.nodeSpace;
	loc.start.y = loc.y - def.nodeHeight/2;

	return loc;
}

// Closest point on a rectangle
function nearestRectPoint(point, rect) {
	var loc = {};
	loc.x = minXDistance(point, rect);
	loc.y = minYDistance(point, rect);

	return loc;
};
function minXDistance(point, rect) {
	if (rect.start.x > point.x)
		return rect.start.x;
	else if (rect.end.x < point.x)
		return rect.end.x;
	else
		return point.x;
};
function minYDistance(point, rect) {
	if (rect.start.y > point.y)
		return rect.start.y;
	else if (rect.end.y < point.y)
		return rect.end.y;
	else
		return point.y;
}

// If point exists on a rectangle
function isPointOnRect(point, rect) {
	if (rect.start.y <= point.y && rect.end.y >= point.y && 
		rect.start.x <= point.x && rect.end.x >= point.x)
		return true;
	else
		return false;
}

// If rectangle exists on a another rectangle
function isRectOnRect(rect1, rect2) {
	var topLeft = {x: rect1.start.x, y: rect1.start.y};
	var topRight = {x: rect1.end.x, y: rect1.start.y};
	var bottomRight = {x: rect1.end.x, y: rect1.end.y};
	var bottomLeft = {x: rect1.start.x, y: rect1.end.y};

	if (isPointOnRect(topLeft, rect2) || isPointOnRect(topRight, rect2) ||
		isPointOnRect(bottomLeft, rect2) || isPointOnRect(bottomRight, rect2))
		return true;
	else
		return false;
}

// Check if a node matrix is in bounds
function nodeMatrixInBounds(matrix) {
	var loc = nodeLoc(matrix); // to rectangular location with start and end

	if (loc.start.x < bound.left || loc.start.y < bound.top ||
		loc.end.x > offset.limitRight || loc.end.y > offset.limitBottom)
		return false;
	else
		return true;
}

// Find an empty location after searching through existing nodes
function nextNodeLoc() {
	var matrix;
	var nextLoc;
	var collision;

	var found = false;
	// Initial location
	var x = 40 + bound.left;
	var y = 80 + bound.top;

	while (! found) {
		matrix = new Snap.Matrix();
		matrix.translate(x, y);
		nextLoc = nodeLoc(matrix);

		// Enlarge the rectangle by a little
		nextLoc.start.x -= 40;
		nextLoc.start.y -= 40;
		nextLoc.end.x += 40;
		nextLoc.end.y += 40;

		collision = false;

		// Check if the next location lies on anything else
		if (isRectOnRect(head.loc(), nextLoc))
			collision = true;
		n.forEach(function (node) {
			if (isRectOnRect(node.loc(), nextLoc))
				collision = true;
		});

		if (collision == true) {
			x += 20;
			y += 2;

			// Go to next line if we've reached a bound
			if (nextLoc.end.x > offset.limitRight)
				x = 200 + bound.left;

			// No more area left to explore
			if (nextLoc.end.y > offset.limitBottom)
				return false;

		} else {
			found = true;
		}
	}

	return nextLoc;
};


/* Health checks */
// Find duplicates
function getDuplicates(list) {
	var checked = [];
	var result = [];

	list.forEach(function (item) {
		checked.forEach(function (itemChecked) {
			if (item == itemChecked)
				result.push(item);
		});
		checked.push(item);
	});

	return result;
}

// Check if items in two lists are the same, inconsiderate of order
function getDifferences(list1, list2) {
	var different = [];

	list1.forEach(function (item1) {
		exists = false;
		list2.forEach(function (item2) {
			if (item1 == item2) {
				exists = true;
			}
		});

		if (! exists)
			different.push(item1);
	});

	return different;
}



/* UI update */
// Show basic notification using Noty
function notification(text, type) {
	if (type === undefined || type == false)
		type = 'alert';

	if (! timeout.disableNotifications)
		noty({
			text: text,
			type: type
		});
};

// Highlight code in Prism
function highlightCode(range) {
	code.attr('data-line', range);
	Prism.highlightElement(codeEl);

	var lineHighlight = $('.line-highlight:first');
	var offset = lineHighlight.offset().top + $('pre').scrollTop();

	$('pre').animate({
		scrollTop: offset
	});
};
