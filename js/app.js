/**
 * Setup UI and user usable functions
 */

busy = true;

// Create head
var head = new node('', bound.left + 60, bound.top + 120);
head.group.attr({
	id: 'head'
});

// Create new nodes in a chain
var chain = new TimeoutChain();

chain.add(200, function () {
	n[0] = new node(40, bound.left + 120, bound.top + 270);
	head.connect(n[0]);
	head.updateLine();
});
chain.add(200, function () {
	n[1] = new node(16, bound.left + 300, bound.top + 270);
	n[0].connect(n[1]);
	n[0].updateLine();
});
chain.add(200, function () {
	n[2] = new node(55, bound.left + 150, bound.top + 420);
	n[1].connect(n[2]);
	n[1].updateLine();
});
chain.add(200, function () {
	n[3] = new node(72, bound.left + 330, bound.top + 420);
	n[2].connect(n[3]);
	n[2].updateLine();

	busy = false; // Enable controls

	generateGoal();
});

chain.start();


/* Insert event */
$('#insert').submit(function (e) {
	e.preventDefault();
	if (busy)
		return false;
	busy = true; // Disable controls

	var text = $('#insert-text');
	var val = parseInt(text.val());
	var x = e.clientX - def.nodeWidth/2;
	var y = e.clientY - def.nodeHeight/2;
	var index = n.length;

	var loc = nextNodeLoc();

	if (loc) { // An empty location found
		text.val(randomInt(1, 999));

		n[index] = new node(val, loc.x, loc.y);

		notification("Created a new node.");
		highlightCode('11,12');

		// Delayed executed steps
		var chain = new TimeoutChain();

		chain.add(speed.normal, function () {
			n[index].connect(head.next);
			n[index].updateLine(500);

			notification("Set node's pointer to head.");
			highlightCode('11,13');
		});
		chain.add(speed.normal, function () {
			head.connect(n[index]);
			head.updateLine(500);

			notification("Set head pointer to the new node.");
			highlightCode('11,14');
		});
		chain.add(speed.normal, function () {
			n[index].highlight = true;

			notification("Node successfully inserted.", 'success');

			busy = false; // Enable controls

			refreshNodes();
			n[index].highlight = false;

			checkGoal('insert', n[index].value);
		});
		chain.start();

	} else { // No location found
		if ( notice.noSpace ) {
			notice.noSpace.close();
			notice.noSpace = false;
		}
		$.noty.clearQueue();
		notice.noSpace = noty({
			text: "No more area on screen left to add nodes. Try moving some nodes around to create space",
			type: 'warning'
		});

		busy = false;
	}
});


/* Search event */
$('#search').submit(function (e) {
	e.preventDefault();
	if (busy)
		return false;
	busy = true; // Disable controls

	var value = parseInt($('#search-text').val());
	searchValue(value);
});


/* Remove event */
$('#remove').submit(function (e) {
	e.preventDefault();
	if (busy)
		return false;
	busy = true; // Disable controls

	var index = parseInt($('#remove-text').val());

	notification("Executing delete...");
	highlightCode('36-37');

	setTimeout(function () {
		searchIndex(index, deleteNode, ',36-37');
	}, speed.normal);

});


/* Search function */
function searchValue(searchVal, action, codeRange) {
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
						highlightCode('16,30-34' + codeRange);

						if ( action ) {
							action(current, nodePrev);
						} else {
							busy = false; // Enable controls
							checkGoal('search', searchVal);
						}
					}, speed.normal);

					clearInterval(searching);
				} else {
					highlightCode('16,21,24-26' + codeRange);
				}

			}, speed.short);

		} else {
			notification("Data not found, linked list exhausted.", 'error');
			highlightCode('16,28-29');

			refreshNodes();

			current.setInnerClass('wobble');

			busy = false;
			clearInterval(searching);
		}

	}, speed.normal);
};


function searchIndex(index, action, codeRange) {
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
						highlightCode('16,30-34' + codeRange);

						if ( action ) {
							action(current, nodePrev);
						} else {
							busy = false; // Enable controls
							checkGoal('search', searchVal);
						}
					}, speed.normal);

					clearInterval(searching);
				} else {
					highlightCode('16,21,24-26' + codeRange);
				}

			}, speed.short);

		} else {
			notification("Data not found, linked list exhausted.", 'error');
			highlightCode('16,28-29');

			refreshNodes();

			current.setInnerClass('wobble');

			busy = false;
			clearInterval(searching);
		}

	}, speed.normal);
};

/* Delete function */
function deleteNode(node, nodePrev) {
	var chain = new TimeoutChain();

	chain.add(speed.normal, function () {
		nodePrev.connect(node.next);
		nodePrev.updateLine(speed.updateLine);

		notification("Set previous pointer to current's next.");
		highlightCode('36,39-40');
	});
	chain.add(speed.normal, function () {
		notification("Delete successful! The node can't be accessed anymore by functions and will be garbage collected.", 'success');

		n = _.reject(n, function (el) { return el === node; });
		node.delete();

		busy = false; // Enable controls
		checkGoal('remove', node.value);
	});

	chain.start();
};
