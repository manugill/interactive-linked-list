n[0] = new node(250, 50);
head = n[0];
n[1] = new node(350, 120);
//n[2] = new node(450, 190);
//n[3] = new node(550, 260);
//n[4] = new node(650, 350);

n[0].connect(n[1]);
//n[1].connect(n[2]);
//n[2].connect(n[3]);
//n[3].connect(n[4]);
console.log(n[0].loc());

$('.add-node').mousedown(function(e) {
	e.preventDefault();

	var x = e.clientX - def.nodeWidth/2;
	var y = e.clientY - def.nodeHeight/2;

	var c = n.length;
	n[c] = new node(500, 500);
	n[c].connect(head);
	head = n[c];
});

