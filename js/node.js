// Nodes
function node(value, x, y, next) {
	nMax++;
	this.id = nMax;
	this.value = value;
	this.next = next;
	this.disabled = false;
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
	this.pointer = s.polyline();
	this.pointer.attr(def.attrPointer);
	this.pointer.appendTo(base.pointers);

	/* Functions */
	// Select group element by id for updates (objects die)
	this.get = function() {
		return document.getElementById(this.group.attr('id'));
	};

	this.setClass = function(classes) {
		var element = this.get();
		element.setAttribute('class', def.attrNode.class + ' ' + classes);
	};

	this.refresh = function() {
		this.updateLine();

		// select using id because objects die out when location is changed
		var element = this.get();
		var towards = this.pointerOn;
		var classes = '';

		if (this.dragging == 'left')
			classes += 'dragging';

		if (this.highlight)
			classes += 'highlight';

		this.setClass(classes);
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
	};

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
		var fromLoc = this.loc();
		var toLoc = false;
		fromLoc.x = fromLoc.x + def.nodeWidth - def.nodeWidth/4;
		fromLoc.y = fromLoc.y + def.nodeHeight - def.nodeHeight/2;

		var from = fromLoc.x + ',' + fromLoc.y
		var to = '';

		// Draw line to something
		if (this.pointerAt)
			toLoc = this.pointerAt;
		else if ( this.next !== undefined )
			toLoc = nearestRectPoint(fromLoc, this.next.loc());

		if (toLoc) {
			to = toLoc.x + ',' + toLoc.y;
		} else {
			to = (fromLoc.x + 40) + ',' + (fromLoc.y) + ' ' +
			     (fromLoc.x + 40) + ',' + (fromLoc.y + 40)
		}

		this.pointer.attr({
			points: from + ' ' + to
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
		} else if (current.pointerAt) {
			current.next = undefined;
		}

		current.dragging = false;
		current.pointerAt = false;
		current.pointerOn = false;

		refreshNodes();
	});

	// Done?
	this.updateLine();
}
