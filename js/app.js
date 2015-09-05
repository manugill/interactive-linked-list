var head = new node('', 200, 50);

n[0] = new node(40, 250, 150);
head.connect(n[0]);
head.group.attr({
	id: 'head'
});

n[1] = new node(16, 400, 150);
n[0].connect(n[1]);


// Refresh nodes for any state updates
function refreshNodes() {
	// refresh head and its pointer
	head.refresh();

	n.forEach(function(node) {
		// refresh node and its pointer
		node.refresh();

	});

	// health check for loops
	var occurred = [];
}


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

	$node = $('#' + n[c].group.attr('id'));
	$node.notify(
	  "I'm left of the box", 
	  { position:"left" }
	);
	$.notify('Node added');
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


var deleteNode = function (node) {
	$.notify('Found value, pointed previous to its next');
	console.log(node);
	node.prev.connect(node.next);

	refreshNodes();

	setTimeout(function() {
		$.notify('Garbage collected');
		n = _.reject(n, function(el) { return el === node; });
		node.delete();

		refreshNodes;

		console.log(n);
	}, 500);
}

var searchNode = function (searchVal, action) {
	// Point to head and highlight
	current = head;
	current.highlight = true;
	refreshNodes();

	var searching = setInterval(function() {
		current.highlight = false;

		if ( current.next ) {
			current = current.next;
			current.highlight = true;

			refreshNodes();

			// Found the value
			if ( current.value == searchVal ) {
				clearInterval(searching);
				current.highlight = false;

				if ( action )
					action(current);
				else
					$.notify('Found node');
			}
		} else {
			$.notify('Not found');
			clearInterval(searching);
			refreshNodes();
		}

	}, 500);
}