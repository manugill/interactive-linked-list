/**
 * Setup UI and user usable functions
 */

busy = true;

// Create head
var head = new node('', bound.left + 50, bound.top + 70);
head.group.attr({
	id: 'head'
});

// Create new nodes in a chain
var chain = new TimeoutChain();

chain.add(200, function () {
	n[0] = new node(40, bound.left + 130, bound.top + 180);
	head.connect(n[0]);
	head.updateLine();
});
chain.add(200, function () {
	n[1] = new node(16, bound.left + 160, bound.top + 290);
	n[0].connect(n[1]);
	n[0].updateLine();
});
chain.add(200, function () {
	n[2] = new node(55, bound.left + 190, bound.top + 400);
	n[1].connect(n[2]);
	n[1].updateLine();
});
chain.add(200, function () {
	n[3] = new node(72, bound.left + 220, bound.top + 510);
	n[2].connect(n[3]);
	n[2].updateLine();

	busy = false; // Enable controls

	generateGoal();
});

chain.start();


/* Insert event */
$('#insert').on('valid.fndtn.abide', function(e) {
	if (busy)
		return false;
	busy = true; // Disable controls

	var text = $('#insert-text');
	var val = parseInt(text.val());
	var index = n.length;

	var loc = nextNodeLoc();

	if (loc) { // An empty location found
		n[index] = new node(val, loc.x, loc.y);

		text.val(randomInt(1, 999));
		notification("Created a new node.");
		highlightCode('10,11');

		// Delayed executed steps
		var chain = new TimeoutChain();

		chain.add(speed.normal, function () {
			n[index].connect(head.next);
			n[index].updateLine(500);

			notification("Set node's pointer to head.");
			highlightCode('10,12');
		});
		chain.add(speed.normal, function () {
			head.connect(n[index]);
			head.updateLine(500);

			notification("Set head pointer to the new node.");
			highlightCode('10,13');
		});
		chain.add(speed.normal, function () {
			notification("Node successfully inserted.", 'success');
			n[index].highlight = true;
			refreshNodes();
			n[index].highlight = false;

			busy = false; // Enable controls
			checkGoal('insert', n[index].value);
		});
		chain.start();

	} else { // No location found
		if (! notice.noSpace || notice.noSpace.showing == false) {
			$.noty.clearQueue();
			notice.noSpace = noty({
				text: "No more area on screen left to add nodes. Try moving some nodes around to create space",
				type: 'warning'
			});
		}

		busy = false;
	}
});


/* Search event */
$('#search').on('valid.fndtn.abide', function(e) {
	if (busy)
		return false;
	busy = true; // Disable controls

	var value = parseInt($('#search-text').val());
	searchValue(value);
});


/* Remove event */
$('#remove').on('valid.fndtn.abide', function(e) {
	if (busy)
		return false;
	busy = true; // Disable controls

	var index = parseInt($('#remove-text').val());
	searchIndexAndDelete(index);
});


/* Search function */
function searchValue(searchVal, codeRange) {
	if (codeRange === undefined)
		codeRange = '';

	// Point to head and highlight
	var index = -1;
	var nodePrev = false;
	var current = head;
	current.highlight = true;
	refreshNodes();

	notification("Searching for node with value " + searchVal + "...");
	highlightCode('15-19' + codeRange);

	var searching = setInterval(function () {
		current.highlight = false;

		if ( current.next ) {
			index++;
			nodePrev = current;
			current = current.next;

			current.highlight = true;
			refreshNodes();

			highlightCode('15,22' + codeRange);

			setTimeout(function () {
				// Found the value
				if ( current.value == searchVal ) {
					clearInterval(searching);
					current.highlight = false;

					highlightCode('15,22-24' + codeRange);

					setTimeout(function () {
						notification("Node found! Index = " + index , 'success');
						current.setInnerClass('tada');
						highlightCode('15,30-35' + codeRange);

						busy = false; // Enable controls
						checkGoal('search', searchVal);
					}, speed.normal);

				} else {
					highlightCode('15,22,25-28' + codeRange);
				}

			}, speed.short);

		} else {
			clearInterval(searching);
			notification("Value not found, linked list exhausted.", 'error');
			highlightCode('15,36-37');

			refreshNodes();

			current.setInnerClass('wobble');

			busy = false;
		}

	}, speed.normal);
};

function searchIndexAndDelete(searchInd, codeRange) {
	if (codeRange === undefined)
		codeRange = '';

	// Point to head and highlight
	var index = -1;
	var nodePrev = false;
	var current = head;
	current.highlight = true;
	refreshNodes();

	notification("Searching for node with index " + searchInd + "...");
	highlightCode('39-43');

	var searching = setInterval(function () {
		current.highlight = false;

		if ( current.next ) {
			index++;
			nodePrev = current;
			current = current.next;

			current.highlight = true;
			refreshNodes();

			highlightCode('39,46' + codeRange);

			setTimeout(function () {
				// Found the index
				if ( index == searchInd ) {
					clearInterval(searching);
					current.highlight = false;

					highlightCode('39,46-48' + codeRange);
					notification("Node found!", 'success');

					setTimeout(function () {
						current.setInnerClass('tada');
						deleteNode(current, nodePrev);
					}, speed.normal);
				} else {
					highlightCode('39,46,49-52' + codeRange);
				}

			}, speed.short);

		} else {
			clearInterval(searching);
			notification("Data not found, linked list exhausted.", 'error');
			highlightCode('39,46,49-52');

			refreshNodes();
			current.setInnerClass('wobble');

			busy = false;
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
		highlightCode('39,54-55');
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
