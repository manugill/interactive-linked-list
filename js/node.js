// Nodes
function node(x, y, prev, next) {
	this.prev = prev;
	this.next = next;
	this.dragging = false;

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
		var loc = {};
		loc.x = this.group.matrix.e;
		loc.y = this.group.matrix.f;

		return loc;
	}
	this.locSize = function() {
		var loc = this.loc();
		var size = {};
		size.x = loc.x + def.nodeWidth;
		size.y = loc.y + def.nodeHeight;

		return size;
	}
	this.locCenter = function() {
		var loc = this.loc();
		var center = {};
		center.x = loc.x + def.nodeWidth/2;
		center.y = loc.y + def.nodeHeight/2;

		return center;
	}

	// Connect nodes
	this.connect = function(nextNode) {
		this.next = nextNode;
		nextNode.prev = this;

		this.updateLine();
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
				to = this.next.locCenter();
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
		var parent = this.p;
		var loc = parent.loc();

		// on drag start
		if ( parent.dragging == false ) {
			if (loc.x + def.nodeWidth/2 > posX) { // dragging on the left half the rectangle
				parent.dragging = 'left';
			} else {
				parent.dragging = 'right';
			}
		}

		if (parent.dragging == 'left') { // dragging on the left half the rectangle
			this.attr({
				transform: this.data('origTransform') + (this.data('origTransform') ? "T" : "t") + [dx, dy]
			});

			parent.updateLine();
			if ( parent.prev !== undefined )
				parent.prev.updateLine();
		} else {
			parent.updateLine({
				x: posX, y: posY
			});
		}

	}, function(dx, dy, posX, posY, e) {
		this.data('origTransform', this.transform().local );

	}, function() {
		var parent = this.p;
		parent.dragging = false;

		parent.updateLine();
	});

	// Done?
	this.updateLine();
}