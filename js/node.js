// Nodes
function node(value, x, y, next) {
	nMax++;
	this.id = nMax;
	this.value = value;
	this.next = next;
	this.dragging = false;
	this.highlight = false;
	this.pointerAt = false;
	this.pointerOn = false;

	// Setup group
	this.group = s.group(def.attrGroup);
	this.group.p = this; // link group element to object, for drag events
	this.group.attr({
		transform: 't' + x + ',' + y,
		class: 'node',
		id: 'n' + nMax
	});
	this.group.appendTo(base.nodes);

	this.inner = s.group();
	this.inner.p = this; // link group element to object, for drag events
	this.inner.attr({
		class: 'inner'
	});
	this.inner.appendTo(this.group);

	// Inner elements
	this.r1 = s.rect(0, 0, def.nodeWidth/2, def.nodeHeight);
	this.r1.attr(def.attrRect);
	this.r1.appendTo(this.inner);

	this.t = s.text(def.nodeWidth/4, def.nodeHeight/2, this.value)
	this.t.attr(def.attrText);
	this.t.appendTo(this.inner);

	this.r2 = s.rect(def.nodeWidth/2, 0, def.nodeWidth/2, def.nodeHeight);
	this.r2.attr(def.attrRect);
	this.r2.appendTo(this.inner);

	this.c1 = s.circle(def.nodeWidth - def.nodeWidth/4, def.nodeHeight - def.nodeHeight/2, 3);
	this.c1.attr(def.attrCircle);
	this.c1.appendTo(this.inner);

	// Connected line, not appened to the group
	this.pointer = s.line();
	this.pointer.attr(def.attrPointer);
	this.pointer.appendTo(base.pointers);

	/* Functions */
	// Select group element by id for updates (objects die quickly)
	this.get = function() {
		return document.getElementById(this.group.attr('id'));
	}

	this.setClass = function(classes) {
		var element = this.get();
		element.setAttribute('class', def.attrNode.class + ' ' + classes);
	}


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
	this.updateLine = function () {
		// Pointer location
		var to = {};
		var from = this.loc();
		from.x = from.x + def.nodeWidth - def.nodeWidth/4;
		from.y = from.y + def.nodeHeight - def.nodeHeight/2;

		// Draw line to
		if ( this.pointerAt ) {
			to = this.pointerAt;
		} else {
			if ( this.next !== undefined ) {
				toLoc = this.next.loc();
				to = nearestRectPoint(from, toLoc);
			} else {
				// Point to the same location as the from
				to = from;
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

			n.forEach(function(node) {
				if (node != current && isPointOnRect(mouseLoc, node.loc())) {
					current.pointerOn = node;
					current.pointerOn.highlight = true;
				}
			});
		}

		refreshNodes();

	}, function(dx, dy, posX, posY, e) {
		this.data('origTransform', this.transform().local );

	}, function() {
		var current = this.p;

		if (current.pointerOn) {
			current.pointerOn.highlight = false;
			current.connect(current.pointerOn);
		}

		current.dragging = false;
		current.pointerAt = false;
		current.pointerOn = false;

		refreshNodes();
	});

	// Done?
	this.updateLine();
}


// Refresh nodes for any state updates
function refreshNodes() {
	n.forEach(function(node) {
		node.updateLine();

		// select using id because objects die out when location is changed
		var element = node.get();
		var towards = node.pointerOn;
		var classes = '';

		if (node.dragging == 'left') {
			classes += 'dragging';
		}

		if (node.highlight)
			classes += 'highlight';

		node.setClass(classes);


	});
}