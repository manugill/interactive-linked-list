/*
 * Goals
 */

var $goalMax = $('.goal-max');
var $goalCount = $('.goal-count');
var $goalHeading = $('.goal-heading');
var $goalTitle = $('.goal-title');
var $goalText = $('.goal-text');

var goalPrev = {};
var goal = {};
var goalCount = -1;
var goalMax = 5;

$goalMax.html(goalMax);

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
		goal.title = 'Searching a value';
		goal.text = 'Search for ' + goal.value + ' in the linked list.';
	} else if ( action == 2 ) {
		goal.type = 'remove';
		goal.value = value;
		goal.title = 'Removing a node';
		goal.text = 'Remove node with value ' + goal.value + ' from the linked list.';
	} else {
		goal.type = 'insert';
		goal.value = randomInt(1, 999);
		goal.title = 'Inserting a node';
		goal.text = 'Insert ' + goal.value + ' to the linked list.';
	}

	goalPrev = goal;
	goalCount++;

	updateGoalView();
}

function updateGoalView() {
	$goalCount.html(goalCount);
	$goalTitle.html(goal.title);
	$goalText.html(goal.text);
}

function checkGoal(type, value) {
	if ( type == goal.type && value == goal.value ) {
		var percent = goalCount / goalMax * 100;

		$goalHeading.addClass('jello');
		setTimeout(function () {
			$goalHeading.removeClass('jello');
		}, 1000);

		if( goalCount < goalMax - 1 ) {
			generateGoal();
		} else {
			goalCount++;
			goal.title = 'Explore it';
			goal.text = 'Feel free to play around with the linked list!';
			goal.type = 'explore';
			goal.value = -1;
			updateGoalView();
		}
	}
}