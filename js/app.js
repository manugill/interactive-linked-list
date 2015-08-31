var head = new node('', 200, 50);

n[0] = new node(40, 250, 150);
head.connect(n[0]);
head.group.attr({
	id: 'head'
})


n[1] = new node(16, 400, 150);
n[0].connect(n[1]);


// Refresh nodes for any state updates
function refreshNodes() {
	head.refresh();

	n.forEach(function(node) {
		node.refresh();
	});
}



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
});

$('#search').submit(function(e) {
	e.preventDefault();

	var value = parseInt($('#search-text').val());
	current = head;
	current.highlight = true;

	refreshNodes();

	var searching = setInterval(function() {
		current.highlight = false;
		console.log(current);

		if ( current.next ) {
			current = current.next;
			current.highlight = true;

			refreshNodes();

			// Found the value
			if ( current.value == value ) {
				alert('Found');
				clearInterval(searching);
				current.highlight = false;
			}
		} else {
			alert('Not found');
			clearInterval(searching);

			refreshNodes();
		}

	}, 500);
});

$('#remove').submit(function(e) {
	e.preventDefault();

	var searchFor = parseInt($('#search-text').val());
	current = head;

	current.highlight = true;

	refreshNodes();

	var searching = setInterval(function() {
		current.highlight = false;
		console.log(current);

		if ( current.next ) {
			current = current.next;
			current.highlight = true;

			refreshNodes();

			// Found the value
			if ( current.value == searchFor ) {
				alert('Found');
				clearInterval(searching);
				current.highlight = false;
			}
		} else {
			alert('Not found');
			clearInterval(searching);

			refreshNodes();
		}

	}, 500);
});
