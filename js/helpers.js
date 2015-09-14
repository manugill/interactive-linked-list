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

/* SVG */
var getNodeCollisions = function () {
};

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

function isPointOnRect(point, rect) {
	if ( rect.start.y < point.y && rect.end.y > point.y
		 && rect.start.x < point.x && rect.end.x > point.x )
		return true;
	else
		return false;
};

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

	noty({
		text: text,
		type: type
	});
};

var highlightCode = function (range) {
	code.attr('data-line', range);
	Prism.highlightElement(codeEl);

	$('pre').animate({
		scrollTop: $('.line-highlight:first').offset().top
	});
};