n[0] = new node(40, 250, 150);
head = n[0];
n[1] = new node(16, 400, 150);
//n[2] = new node(450, 190);
//n[3] = new node(550, 260);
//n[4] = new node(650, 350);

n[0].connect(n[1]);
//n[1].connect(n[2]);
//n[2].connect(n[3]);
//n[3].connect(n[4]);

$('button.insert').click(function(e) {
	e.preventDefault();

	var x = e.clientX - def.nodeWidth/2;
	var y = e.clientY - def.nodeHeight/2;

	var c = n.length;
	var val = Math.floor((Math.random() * 60) + 1);

	n[c] = new node(val, 250, 50);
	n[c].connect(head);
	head = n[c];
});

$('button.search').click(function(e) {
	e.preventDefault();

	var searchFor = parseInt($('#search').val());
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
		}

	}, 500);
});
