/*
 * Goals
 */

var $goalsMax = $('#goals .max');
var $goalsHeading = $('#goals .heading');
var $goalsCompleted = $('#goals .completed');
var $goalCount = $('#goal .count');
var $goalText = $('#goal .text');
var $goalMeter = $('#goal .meter');

var goalPrev = {};
var goal = {};
var goalCount = 0;
var goalsMax = 4;

$goalsMax.html(goalsMax);

function generateGoal() {
	var action = randomInt(1, 3);
	var values = getNodeValues();
	var valueIndex = randomInt(0, values.length-1);
	var value = values[valueIndex];

	if ( value === 'undefined' ) {
		action = 1;
	} else if ( action == goalPrev.action ) {
		// Try not to repeat goals
		generateGoal();
		return;
	}

	goal.action = action;

	if ( action == 1 ) {
		goal.type = 'search';
		goal.value = value;
		goal.text = 'Search for ' + goal.value + ' in the linked list.';
	} else if ( action == 2 ) {
		goal.type = 'remove';
		goal.value = value;
		goal.text = 'Remove node with value ' + goal.value + ' from the linked list.';
	} else {
		goal.type = 'insert';
		goal.value = randomInt(1, 999);
		goal.text = 'Insert ' + goal.value + ' to the linked list.';
	}

	goalPrev = goal;

	goalCount++;

	$goalCount.html(goalCount);
	$goalsCompleted.html(goalCount-1);
	$goalText.html(goal.text);
}

function checkGoal(type, value) {
	if ( type == goal.type && value == goal.value ) {
		var percent = goalCount / goalsMax * 100;

		if ( percent <= 101 )
			$goalMeter.css('width', percent + '%');

		$goalsHeading.addClass('jello');
		setTimeout(function () {
			$goalsHeading.removeClass('jello');
		}, 1000);

		generateGoal();
	}
}