/* Helpers */
// http://stackoverflow.com/questions/4994201/is-object-empty
var hasOwnProperty = Object.prototype.hasOwnProperty;
var isEmpty = function (obj) {
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


/* Geometry */
// Closest point on rectangle point a given point
var nearestRectPoint = function (point, rect) {
	var loc = {};
	loc.x = minXDistance(point, rect);
	loc.y = minYDistance(point, rect);

	return loc;
};
var minXDistance = function (point, rect) {
	if (rect.start.x > point.x)
		return rect.start.x;
	else if (rect.end.x < point.x)
		return rect.end.x;
	else
		return point.x;
};
var minYDistance = function (point, rect) {
	if (rect.start.y > point.y)
		return rect.start.y;
	else if (rect.end.y < point.y)
		return rect.end.y;
	else
		return point.y;
};

var isPointOnRect = function (point, rect) {
	if (rect.start.y <= point.y && rect.end.y >= point.y && 
		rect.start.x <= point.x && rect.end.x >= point.x)
		return true;
	else
		return false;
};

var isRectOnRect = function (rect1, rect2) {
	var topLeft = {x: rect1.start.x, y: rect1.start.y};
	var topRight = {x: rect1.end.x, y: rect1.start.y};
	var bottomRight = {x: rect1.end.x, y: rect1.end.y};
	var bottomLeft = {x: rect1.start.x, y: rect1.end.y};

	if (isPointOnRect(topLeft, rect2) || isPointOnRect(topRight, rect2) ||
		isPointOnRect(bottomLeft, rect2) || isPointOnRect(bottomRight, rect2))
		return true;
	else
		return false;
};

// Check if a node matrix is in bounds
var nodeMatrixInBounds = function (matrix) {
	var loc = nodeLoc(matrix); // to rectangular location with start and end

	if (loc.start.x < bound.left || loc.start.y < bound.top ||
		loc.end.x > offset.limitRight || loc.end.y > offset.limitBottom)
		return false;
	else
		return true;
};

// Generate a loc object with start end of a node.
var nodeLoc = function (matrix) {
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
};


// Find an empty location after searching through nodes
var nextNodeLoc = function () {
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


// Health check helpers
var findDuplicates = function (list) {
	var seen = [];
	var result = [];

	list.forEach(function (item) {
		seen.forEach(function (item_seen) {
			if (item == item_seen)
				result.push(item);
		});
		seen.push(item);
	});

	return result;
};



/* Code highlighting & notifications */
var notification = function (text, type) {
	if (type === undefined || type == false)
		type = 'alert';

	if (! timeout.disableNotifications)
		noty({
			text: text,
			type: type
		});
};

var highlightCode = function (range) {
	code.attr('data-line', range);
	Prism.highlightElement(codeEl);

	var lineHighlight = $('.line-highlight:first');
	var offset = lineHighlight.offset().top + $('pre').scrollTop();

	$('pre').animate({
		scrollTop: offset
	});
};