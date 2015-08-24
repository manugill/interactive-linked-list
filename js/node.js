// Nodes
function node(x, y, next) {
	this.next = next;
	this.dragging = false;
	this.pointerOn = false;

	// Setup group
	this.group = s.group(def.attrGroup);
	this.group.p = this; // link group element to object, for drag events
	this.group.attr({
		transform: 't' + x + ',' + y
	});

	// Inner elements
	this.r1 = s.rect(0, 0, def.nodeWidth/2, def.nodeHeight);
	this.r1.attr(def.attrRect);
	this.r1.appendTo(this.group);

	this.r2 = s.rect(def.nodeWidth/2, 0, def.nodeWidth/2, def.nodeHeight);
	this.r2.attr(def.attrRect);
	this.r2.appendTo(this.group);

	this.c1 = s.circle(def.nodeWidth - def.nodeWidth/4, def.nodeHeight - def.nodeHeight/2, 3);
	this.c1.attr(def.attrCircle);
	this.c1.appendTo(this.group);

	// Connected line, not appened to the group
	this.pointer = s.line();
	this.pointer.attr(def.attrPointer);

	/* Functions */
	// Get location
	this.loc = function() {
		var loc = {}; // x and y are the top left point
		loc.x = this.group.matrix.e;
		loc.y = this.group.matrix.f;

		loc.end = {}; // end.x and end.y are the bottom right point
		loc.end.x = loc.x + def.nodeWidth;
		loc.end.y = loc.y + def.nodeHeight;

		return loc;
	}

	// Connect nodes
	this.connect = function(nextNode) {
		if (nextNode == this)
			this.next = undefined;
		else
			this.next = nextNode;

		refreshNodes();
	};

	// Update line
	this.updateLine = function (to) {
		// Pointer location
		var from = this.loc();
		from.x = from.x + def.nodeWidth - def.nodeWidth/4;
		from.y = from.y + def.nodeHeight - def.nodeHeight/2;

		// Draw line to
		if ( to === undefined ) {
			if ( this.next !== undefined ) {
				toLoc = this.next.loc();
				to = nearestRectPoint(from, toLoc);
			} else {
				// Point to the same location as the other
				to = {};
				to.x = from.x;
				to.y = from.y;
			}
		}

		this.pointer.attr({
			x1: from.x,
			y1: from.y,
			x2: to.x,
			y2: to.y
		});
	};

	// Do drag stuff
	this.group.drag(function(dx, dy, posX, posY, e) {
		var current = this.p; // get parent node of the group
		var loc = current.loc();
		var mouseLoc = {x: posX, y: posY};

		if ( current.dragging == false ) { // on drag start
			if (loc.x + def.nodeWidth/2 > posX) { // on the left half the rectangle
				current.dragging = 'left';
			} else {
				current.dragging = 'right';
			}
		}


		if (current.dragging == 'left') {
			this.attr({
				transform: this.data('origTransform') + (this.data('origTransform') ? "T" : "t") + [dx, dy]
			});

			refreshNodes();
		} else {
			current.pointerOn = false;

			n.forEach(function(node) {
				if (isPointOnRect(mouseLoc, node.loc())) {
					current.pointerOn = node;
					current.group.addClass('highlight');
				}
			});

			current.updateLine(mouseLoc);
		}

	}, function(dx, dy, posX, posY, e) {
		this.data('origTransform', this.transform().local );

	}, function() {
		var current = this.p;

		if (current.pointerOn)
			current.connect(current.pointerOn);

		current.pointerOn = false;
		current.dragging = false;

		current.updateLine();
	});

	// Done?
	this.updateLine();
}


function refreshNodes() {
	n.forEach(function(node) {
		node.updateLine();
	});
}