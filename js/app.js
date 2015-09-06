
var head = new node('', 250, 80);
head.group.attr({
	id: 'head'
});

n[0] = new node(40, 310, 200);
head.connect(n[0]);
head.updateLine();

n[1] = new node(16, 490, 200);
n[0].connect(n[1]);
n[0].updateLine();

n[2] = new node(55, 490, 320);
n[1].connect(n[2]);
n[1].updateLine();

n[3] = new node(72, 660, 320);
n[2].connect(n[3]);
n[2].updateLine();

/* Insert */
$('#insert').submit(function(e) {
	e.preventDefault();

	var text = $('#insert-text');
	var val = parseInt(text.val());
	var x = e.clientX - def.nodeWidth/2;
	var y = e.clientY - def.nodeHeight/2;
	var c = n.length;

	text.val(Math.floor((Math.random() * 99) + 1));

	n[c] = new node(val, 400, 50);
	n[c].connect(head.next);
	head.connect(n[c]);
	head.updateLine(500);
	n[c].updateLine(500);

	noty({
		text: 'Node added'
	});

	setTimeout(function () {
		refreshNodes();
	}, 1000);
});

/* Search */
$('#search').submit(function(e) {
	e.preventDefault();

	var value = parseInt($('#search-text').val());
	
	searchNode(value);
});

/* Remove */
$('#remove').submit(function(e) {
	e.preventDefault();

	var value = parseInt($('#remove-text').val());
	searchNode(value, deleteNode);
});


var deleteNode = function (node, nodePrev) {
	setTimeout(function () {
		noty({
			text: 'Updated pointer of previous node.'
		});

		nodePrev.connect(node.next);
		nodePrev.updateLine(500);
	}, 1000);

	setTimeout(function () {
		noty({
			text: 'Garbage collected.'
		});

		n = _.reject(n, function(el) { return el === node; });
		node.delete();

		busy = false;

		setTimeout(function () {
			refreshNodes();
		}, 1000);
	}, 2000);
}

var searchNode = function (searchVal, action) {
	if (busy)
		return false;
	busy = true;

	// Point to head and highlight
	var current = head;
	var nodePrev = false;
	current.highlight = true;
	refreshNodes();

	var searching = setInterval(function() {
		current.highlight = false;

		if ( current.next ) {
			nodePrev = current;
			current = current.next;
			current.highlight = true;

			refreshNodes();

			// Found the value
			if ( current.value == searchVal ) {
				current.highlight = false;

				setTimeout(function () {
					current.setInnerClass('tada');

					noty({
						text: 'Node found.',
						type: 'success'
					});

					if ( action )
						action(current, nodePrev);
					else
						busy = false;
				}, 900);

				clearInterval(searching);
			}

		} else {
			noty({
				text: 'Node not found, linked list exhausted.',
				type: 'error'
			});

			refreshNodes();

			current.setInnerClass('wobble');

			busy = false;
			clearInterval(searching);
		}

	}, 900);
}