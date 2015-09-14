/*
 * Node object
 * The primary group element's position is the center, all other elements are aligned around
 */
function node(value, x, y, next) {
	nMax++;
	this.id = nMax;
	this.value = value;
	this.next = next;
	this.disabled = false;
	this.dragging = false;
	this.highlight = false;
	this.highlightLine = false;
	this.pointerAt = false;
	this.pointerOn = false;

	// Setup group
	this.group = s.group(def.attrNode);
	this.group.p = this; // link group element to object, for drag events
	this.group.attr({
		transform: 't' + x + ',' + y,
		class: 'node',
		id: 'n' + nMax
	});
	this.group.appendTo(base.nodes);

	this.inner = s.group(def.attrNodeInner);
	this.inner.p = this; // link group element to object, for drag events
	this.inner.attr();
	this.inner.appendTo(this.group);

	// Inner elements
	// Place to negative x + space and half negative y
	this.r1 = s.rect(-(def.nodeWidth/2 + def.nodeSpace), -def.nodeHeight/2, def.nodeWidth/2, def.nodeHeight);
	this.r1.attr(def.attrRect);
	this.r1.appendTo(this.inner);

	// Place at x + space and half negative y
	this.r2 = s.rect(def.nodeSpace, -def.nodeHeight/2, def.nodeWidth/2, def.nodeHeight);
	this.r2.attr(def.attrRect);
	this.r2.appendTo(this.inner);

	this.t = s.text(-(def.nodeWidth/4), 0, this.value)
	this.t.attr(def.attrText);
	this.t.appendTo(this.inner);

	// Account for extra spacing
	this.c1X = def.nodeWidth/2 + def.nodeSpace - def.nodeWidth/4;
	this.c1Y = 0;
	this.c1 = s.circle(this.c1X, this.c1Y, 3);
	this.c1.attr(def.attrCircle);
	this.c1.appendTo(this.inner);

	// Connected line, not appened to the group
	this.pointer = s.polyline();
	this.pointer.attr(def.attrPointer);
	this.pointer.attr({
		id: 'np' + nMax
	});
	this.pointer.appendTo(base.pointers);

	/* Functions */
	// Select group element by id for updates (objects die)
	this.get = function () {
		return document.getElementById(this.group.attr('id'));
	};
	this.getPointer = function () {
		return document.getElementById(this.pointer.attr('id'));
	};

	this.setClass = function (classes) {
		var element = this.get();
		element.setAttribute('class', def.attrNode.class + ' ' + classes);
	};

	this.setInnerClass = function (classes) {
		var element = this.get().getElementsByClassName('inner')[0];
		element.setAttribute('class', def.attrNodeInner.class + ' ' + classes);
	};

	this.setPointerClass = function (classes) {
		var element = this.getPointer();
		element.setAttribute('class', def.attrPointer.class + ' ' + classes);
	};

	this.delete = function () {
		var node = this;

		node.setInnerClass('animated bounceOutDown');
		node.setPointerClass('animated bounceOutUp');

		setTimeout(function () {
			refreshNodes();
		}, 1000);
	};

	this.refresh = function () {
		this.updateLine();

		// select using id because objects die out when location is changed
		var element = this.get();
		var towards = this.pointerOn;
		var classes = '';
		var classesInner = '';
		var classesPointer = '';

		if (this.dragging == 'left') {
			classes += 'dragging ';
		} else if (this.dragging == 'right') {
			classes += 'highlight-self ';
			classesInner += 'pulse ';
		}

		if (this.highlight) {
			classes += 'highlight ';
			classesInner += 'jello ';
		}

		this.setClass(classes);
		this.setInnerClass(classesInner);
	}

	// Get location
	this.loc = function () {
		var loc = {}; // x and y are the top left point
		loc.x = this.group.matrix.e;
		loc.y = this.group.matrix.f;

		loc.end = {}; // end.x and end.y are the bottom right point
		loc.end.x = loc.x + def.nodeWidth/2 + def.nodeSpace;
		loc.end.y = loc.y + def.nodeHeight/2;

		loc.start = {}; // end.x and end.y are the bottom right point
		loc.start.x = loc.x - def.nodeWidth/2 - def.nodeSpace;
		loc.start.y = loc.y - def.nodeHeight/2;

		return loc;
	};

	// Connect nodes
	this.connect = function (nextNode) {
		if (nextNode == this)
			this.next = undefined;
		else
			this.next = nextNode;
	};

	// Update line
	this.updateLine = function (time, callback) {
		var node = this;
		var toLoc = false;
		var fromLoc = node.loc();
		var points = [];

		// Place to the circle center
		fromLoc.x = fromLoc.x + this.c1X;
		fromLoc.y = fromLoc.y + this.c1Y;

		// Draw line to something
		if (node.pointerAt)
			toLoc = this.pointerAt;
		else if ( this.next !== undefined )
			toLoc = nearestRectPoint(fromLoc, this.next.loc());

		if (toLoc)
			points = [fromLoc.x, fromLoc.y, fromLoc.x, fromLoc.y, toLoc.x, toLoc.y]
		else
			points = [fromLoc.x, fromLoc.y, fromLoc.x + 40, fromLoc.y, fromLoc.x + 40, fromLoc.y + 40]

		// Don't animate change or do
		if (time === undefined) {
			node.pointer.attr({
				points: points
			});
		} else {
			// Get current location
			var pointsCurrent = node.pointer.attr().points;
			if (pointsCurrent !== undefined)
				pointsCurrent = pointsCurrent.split(','); // to array
			else
				pointsCurrent = points;

			Snap.animate(pointsCurrent, points, function (val) {
				node.pointer.attr({
					points: val
				});
			}, time, mina.easeinout, callback);
		}

	};

	// Do drag stuff
	this.group.drag(function (dx, dy, posX, posY, e) {
		var current = this.p; // get parent node of the group

		var loc = current.loc();
		var mouseLoc = {x: posX, y: posY};

		if ( current.dragging == false ) { // on drag start
			if (loc.x > posX) { // on the left half the rectangle
				current.dragging = 'left';
			} else {
				current.dragging = 'right';
			}
		}

		if (current.dragging == 'left') {
			if (current.disabled) // don't allow drag if disabled
				return false;

			current.pointerAt = false;

			this.attr({
				transform: this.data('origTransform') + (this.data('origTransform') ? "T" : "t") + [dx, dy]
			});

		} else {
			current.pointerAt = mouseLoc;
			if (current.pointerOn)
				current.pointerOn.highlight = false;
			current.pointerOn = false;
			current.highlight = false;

			n.forEach(function (node) {
				if (node != current && isPointOnRect(mouseLoc, node.loc())) {
					current.pointerOn = node;
					current.pointerOn.highlight = true;
				}
			});
		}

		refreshNodes();

	}, function (dx, dy, posX, posY, e) {
		this.data('origTransform', this.transform().local );

	}, function () {
		var current = this.p;

		if (current.pointerOn) {
			current.pointerOn.highlight = false;
			current.connect(current.pointerOn);
		} else if (current.pointerAt) {
			current.next = undefined;
		}

		current.pointerAt = false;
		current.pointerOn = false;

		if ( current.dragging == 'right') {
			current.updateLine(300, function () {
				refreshNodes();
			});
			current.dragging = false;
		} else {
			current.dragging = false;
			refreshNodes();
		}

	});


	/* Done? Do some shindig (call animations and draw initial line) */
	this.setPointerClass('bounceInDown');
	this.setInnerClass('bounceInUp');
	this.updateLine();
}



/*
 * Global updates
 * Refresh nodes for any state updates
 */
var refreshNodes = function () {
	var occurredNext = [];
	var occurredValue = [];

	// refresh head and its pointer
	head.refresh();
	if (head.next)
		occurredNext.push(head.next);

	n.forEach(function(node) {
		// refresh node and its pointer
		node.refresh();

		if (node.next)
			occurredNext.push(node.next);

		occurredValue.push(node.value);
	});

	// health check for loops
	health.loops = findDuplicates(occurredNext);
	health.duplicates = findDuplicates(occurredValue);

	if (! isEmpty(health.loops)) {
		if (notice.loops == false) {
			notice.loops = noty({
				text: 'Invalid: Loop present between node pointers. It leads to funny consequences.',
				type: 'error',
				timeout: false,
				closeWith: []
			});
		}
	} else {
		if (notice.loops) {
			notice.loops.close();
			notice.loops = false;
		}
	}

	if (! isEmpty(health.duplicates)) {
		if (notice.duplicates == false) {
			notice.duplicates = noty({
				text: 'Invalid: Duplicate values present. Only the first value will be accessible by functions. Try removing the value to fix the issue.',
				type: 'error',
				timeout: false,
				closeWith: []
			});
		}
	} else {
		if (notice.duplicates) {
			notice.duplicates.close();
			notice.duplicates = false;
		}
	}
}