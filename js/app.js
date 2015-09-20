/**
 * Setup UI and user usable functions
 */
busy = true;

// Create head
var head = new node('', 40 + bound.left, 80);
head.group.attr({
	id: 'head'
});

setTimeout(function () {
	n[0] = new node(40, 100 + bound.left, 230);
	head.connect(n[0]);
	head.updateLine();
}, 200);

setTimeout(function () {
	n[1] = new node(16, 280 + bound.left, 230);
	n[0].connect(n[1]);
	n[0].updateLine();
}, 400);
setTimeout(function () {
	n[2] = new node(55, 140 + bound.left, 380);
	n[1].connect(n[2]);
	n[1].updateLine();
}, 600);
setTimeout(function () {
	n[3] = new node(72, 320 + bound.left, 380);
	n[2].connect(n[3]);
	n[2].updateLine();

	busy = false; // Enable controls
}, 800);


/* Insert event */
$('#insert').submit(function (e) {
	e.preventDefault();

	if (busy)
		return false;
	busy = true;

	var text = $('#insert-text');
	var val = parseInt(text.val());
	var x = e.clientX - def.nodeWidth/2;
	var y = e.clientY - def.nodeHeight/2;
	var index = n.length; // we're cool like that

	var loc = nextNodeLoc();
	if (loc) { // An empty location found
		text.val(Math.floor((Math.random() * 99) + 1));
		
		n[index] = new node(val, loc.x, loc.y);

		notification("Added a new node.");
		highlightCode('11,12');

		setTimeout(function () {
			refreshNodes();

			n[index].connect(head.next);
			n[index].updateLine(500);

			notification("Set node's pointer to head.");
			highlightCode('11,13');

			setTimeout(function () {
				head.connect(n[index]);
				head.updateLine(500);

				notification("Set head pointer to the new node.");
				highlightCode('11,14');

				setTimeout(function () {
					notification("Node successfully added.", 'success');

					busy = false;
				}, timeout.mid);
			}, timeout.long);
		}, timeout.long);
	} else {
		// No location found.
		$.noty.clearQueue();
		$.noty.closeAll();
		noty({
			text: "No more area on screen left to add nodes. Please move nodes around or remove some to make space.",
			type: 'warning'
		});
		busy = false;
	}
});


/* Search event */
$('#search').submit(function (e) {
	e.preventDefault();

	var value = parseInt($('#search-text').val());
	searchNode(value);
});


/* Remove event */
$('#remove').submit(function (e) {
	e.preventDefault();

	var value = parseInt($('#remove-text').val());

	notification("Executing delete...");
	highlightCode('36-37');

	setTimeout(function () {
		searchNode(value, deleteNode, ',36-37');
	}, timeout.long);

});


/* Search function */
var searchNode = function (searchVal, action, codeRange) {
	if (busy)
		return false;
	busy = true;

	if (codeRange === undefined)
		codeRange = '';

	// Point to head and highlight
	var current = head;
	var nodePrev = false;
	current.highlight = true;
	refreshNodes();

	notification("Starting search from head...");
	highlightCode('16-19' + codeRange);

	var searching = setInterval(function () {
		current.highlight = false;

		if ( current.next ) {
			nodePrev = current;
			current = current.next;
			current.highlight = true;

			refreshNodes();

			highlightCode('16,21' + codeRange);

			setTimeout(function () {
				// Found the value
				if ( current.value == searchVal ) {
					current.highlight = false;

					highlightCode('16,21-23' + codeRange);

					setTimeout(function () {
						current.setInnerClass('tada');

						notification("Node found!", 'success');
						highlightCode('16,31-34' + codeRange);

						if ( action )
							action(current, nodePrev);
						else
							busy = false;
					}, timeout.long);

					clearInterval(searching);
				} else {
					highlightCode('16,21,24-26' + codeRange);
				}

			}, timeout.short);

		} else {
			notification("Data not found, linked list exhausted.", 'error');
			highlightCode('16,28-29');

			refreshNodes();

			current.setInnerClass('wobble');

			busy = false;
			clearInterval(searching);
		}

	}, timeout.long);
};

/* Delete function */
var deleteNode = function (node, nodePrev) {
	setTimeout(function () {
		nodePrev.connect(node.next);
		nodePrev.updateLine(500);

		notification("Set previous pointer to current's next.");
		highlightCode('36,39-40');

		setTimeout(function () {
			notification("Delete successful! The node can't be accessed anymore by functions and will be garbage collected.", 'success');

			n = _.reject(n, function (el) { return el === node; });
			node.delete();

			busy = false;
		}, timeout.long);
	}, timeout.long);
};