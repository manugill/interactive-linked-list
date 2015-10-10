/*
 * Node object
 * The primary group element's position is the center, all other elements are aligned around
 */
function node(value, x, y) {
	nMax++;
	this.id = nMax;
	this.value = value;
	this.next = undefined;
	this.disabled = false;
	this.dragging = false;
	this.highlight = false;
	this.pointerAt = false;
	this.pointerOn = false;

	// Initial location
	var matrix = new Snap.Matrix();
	matrix.translate(x, y);

	// Setup group
	this.group = s.group(def.attrNode);
	this.group.p = this; // link group element to object, for drag events
	this.group.attr({
		transform: matrix,
		class: 'node',
		id: 'n' + nMax
	});
	this.group.appendTo(base.nodes);

	this.inner = s.group(def.attrNodeInner);
	this.inner.p = this; // link group element to object
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

	// Place at negative 25% node width + space
	this.t = s.text(-(def.nodeWidth/4 + def.nodeSpace), 9, this.value)
	this.t.attr(def.attrText);
	this.t.appendTo(this.inner);

	// Place at 75% node width + space
	this.c1X = def.nodeWidth/2 + def.nodeSpace - def.nodeWidth/4;
	this.c1Y = 0;
	this.c1 = s.circle(this.c1X, this.c1Y, 3);
	this.c1.attr(def.attrCircle);
	this.c1.appendTo(this.inner);

	// Pointerointer group, contains a background line for grabbing and a visible line over it
	this.pointer = s.group();
	this.pointer.p = this; // link group element to object
	this.pointer.attr(def.attrPointer);
	this.pointer.attr({
		id: 'np' + nMax
	});
	this.pointer.appendTo(base.pointers);

	// Polylines in the group
	this.pointerVisible = s.polyline();
	this.pointerVisible.attr(def.attrPointerVisible);
	this.pointerVisible.appendTo(this.pointer);

	this.pointerInvisible = s.polyline();
	this.pointerInvisible.attr(def.attrPointerInvisible);
	this.pointerInvisible.appendTo(this.pointer);

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
		var element = this.get().querySelectorAll('.inner')[0];

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
		return nodeLoc(this.group.matrix);
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
			node.pointerVisible.attr({
				points: points
			});
			node.pointerInvisible.attr({
				points: points
			});
		} else {
			// Get current location
			var pointsCurrent = node.pointerVisible.attr().points;
			if (pointsCurrent !== undefined)
				pointsCurrent = pointsCurrent.split(','); // to array
			else
				pointsCurrent = points;

			Snap.animate(pointsCurrent, points, function (val) {
				node.pointerVisible.attr({
					points: val
				});
			}, time, mina.easeinout, callback);
		}

	};

	this.pointerDragMove = function (mouseLoc) {
		var currentNode = this;
		this.pointerAt = mouseLoc;
		if (this.pointerOn)
			this.pointerOn.highlight = false;

		this.pointerOn = false;
		this.highlight = false;

		n.forEach(function (node) {
			if (node != currentNode && isPointOnRect(mouseLoc, node.loc())) {
				currentNode.pointerOn = node;
				currentNode.pointerOn.highlight = true;
			}
		});
	}

	this.pointerDragEnd = function () {
		if (this.pointerOn) {
			this.pointerOn.highlight = false;
			this.connect(this.pointerOn);
		} else if (this.pointerAt) {
			this.next = undefined;
		}

		this.pointerAt = false;
		this.pointerOn = false;

		// Animate line after drag right end
		if (this.dragging != 'left') {
			this.updateLine(speed.updateLine, function () {
				refreshNodes();
			});
			this.dragging = false;
		}
	};


	/*
	 * Drag Handler
	 */
	this.group.drag(function (dx, dy, posX, posY, e) {
		// Drag move
		var current = this.p; // get parent node of the group

		var loc = current.loc();
		var mouseLoc = {x: posX - offset.left, y: posY - offset.top};

		if ( current.dragging == false ) { // on drag start
			if (loc.x > mouseLoc.x) { // on the left half the rectangle
				current.dragging = 'left';
			} else {
				current.dragging = 'right';
			}
		}

		if (current.dragging == 'left') {
			if (current.disabled) // don't allow drag if disabled
				return false;

			current.pointerAt = false;

			var origMatrix = this.data('origMatrix');
			var dragMatrix = new Snap.Matrix();
			dragMatrix.translate(origMatrix.e + dx, origMatrix.f + dy);

			if (nodeMatrixInBounds(dragMatrix))
				this.attr({
					transform: dragMatrix
				});

		} else {
			current.pointerDragMove(mouseLoc);
		}

		refreshNodes();

	}, function () {
		// Drag start
		// Store original matrix
		this.data('origMatrix', this.matrix);

	}, function () {
		// Drag end
		var current = this.p;

		current.pointerDragEnd();

		if ( current.dragging == 'left') {
			current.dragging = false;
			refreshNodes();
		}

	});

	this.pointer.drag(function (dx, dy, posX, posY, e) {
		// Drag move
		var current = this.p; // get parent node of the group

		var mouseLoc = {x: posX - offset.left, y: posY - offset.top};

		current.pointerDragMove(mouseLoc);

		refreshNodes();

	}, function () {
		// Drag start
	}, function () {
		// Drag end
		var current = this.p;
		current.pointerDragEnd();
	});


	/* Done? Do some shindig (call animations and draw initial line) */
	this.setPointerClass('fadeInDownBig optional');
	this.setInnerClass('zoomInDown optional');
	this.updateLine();
}



/*
 * Global updates
 * Refresh nodes for any state updates
 */
function refreshNodes() {
	var occurredNext = [];

	// refresh head and its pointer
	head.refresh();
	if (head.next)
		occurredNext.push(head.next);

	n.forEach(function(node) {
		node.refresh();

		if ( node.next )
			occurredNext.push(node.next);
	});

	/* Health checks */
	if ( ! busy ) {
		health.loops = isNodeLoop();
		health.disconnected = getDifferences(n, occurredNext);

		if (! isEmpty(health.loops)) {
			if (notice.loops == false) {
				notice.loops = noty({
					text: 'Invalid: More than 1 pointer to a node. It can cause infinite loops when executing search. Try changing one of the pointers.',
					type: 'warning',
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

		if (! isEmpty(health.disconnected)) {
			if (notice.disconnected == false) {
				notice.disconnected = noty({
					text: 'Invalid: Disconnected nodes present. <i class="ion-help-circled expand"></i><span class="info animated bounceIn">Those nodes will not be accessible by functions. Try reconnecting them back.</a></span>',
					type: 'warning',
					timeout: false,
					closeWith: []
				});
			}
		} else {
			if (notice.disconnected) {
				notice.disconnected.close();
				notice.disconnected = false;
			}
		}

		$(document).foundation('tooltip', 'reflow');
	}
}
