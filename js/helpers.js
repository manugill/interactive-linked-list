/* Helpers */
// http://stackoverflow.com/questions/4994201/is-object-empty
var isEmpty = function(obj) {
    // null and undefined are "empty"
    if (obj == null || obj == undefined) return true;

    // Assume if it has a length property with a non-zero value
    // that that property is correct.
    if (obj.length && obj.length > 0)   return false;
    if (obj.length === 0)  return true;

    // Otherwise, does it have any properties of its own?
    // Note that this doesn't handle
    // toString and toValue enumeration bugs in IE < 9
    for (var key in obj) {
        if (hasOwnProperty.call(obj, key))
            return false;
    }

    return true;
}

// Line drawing functions
var getCentreOfElement = function(el) {
    return {x:el.x + el.width/2.0,
            y:el.y + el.height/2.0};
}

var getNearestPointOutside = function(from, to, boxSize) {
    // which side does it hit? 
    // get the angle of to from from.
    // triangle centre, w/2, h/2, same as 0,w,h.
    var theta = Math.atan2(boxSize.y, boxSize.x);
    var phi = Math.atan2(to.y - from.y, to.x - from.x);
    var nearestPoint = {};
    if(Math.abs(phi) < theta) { // crosses +x
        nearestPoint.x = from.x + boxSize.x/2.0;
        nearestPoint.y = from.y + ((to.x === from.x) ? from.y : 
        ((to.y - from.y)/(to.x - from.x) * boxSize.x/2.0));
    } else if(Math.PI-Math.abs(phi) < theta) { // crosses -x
        nearestPoint.x = from.x - boxSize.x/2.0;
        nearestPoint.y = from.y + ((to.x === from.x) ? from.y : 
        (-(to.y - from.y)/(to.x - from.x) * boxSize.x/2.0));
    } else if(to.y > from.y) { // crosses +y
        nearestPoint.y = from.y + boxSize.y/2.0;
        nearestPoint.x = from.x + ((to.y === from.y) ? 0 : 
        ((to.x - from.x)/(to.y - from.y) * boxSize.y/2.0));
    } else { // crosses -y
        nearestPoint.y = from.y - boxSize.y/2.0;
        nearestPoint.x = from.x - ((to.y === from.y) ? 0 :
        ((to.x - from.x)/(to.y - from.y) * boxSize.y/2.0));
    }
    return nearestPoint;
}