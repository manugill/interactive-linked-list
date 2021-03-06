/**
 * Noty.js defaults
 */
$.noty.themes.foundation = {
	name: 'foundation',
	modal: {
		css: {
			position: 'fixed',
			width: '100%',
			height: '100%',
			backgroundColor: '#000',
			zIndex: 10000,
			opacity: 0.6,
			display: 'none',
			left: 0,
			top: 0
		}
	},
	style: function() {
		var containerSelector = this.options.layout.container.selector;
		$(containerSelector).addClass('alert-list');

		this.$closeButton.append('<span aria-hidden="true">&times;</span><span class="sr-only">Close</span>');
		this.$closeButton.addClass('close');

		this.$message.addClass('alert-box radius');

		switch (this.options.type) {
			case 'alert': case 'notification':
				this.$message.addClass('secondary');
				break;
			case 'warning':
				this.$message.addClass('warning');
				break;
			case 'error':
				this.$message.addClass('alert');
				break;
			case 'information':
				this.$message.addClass('info') ;
				break;
			case 'success':
				this.$message.addClass('success');
				break;
		}

	},
	callback: {
		onShow: function() {  },
		onClose: function() {  }
	}
};

$.noty.defaults = {
	layout: 'bottomCenter',
	theme: 'foundation',
	type: 'alert',
	text: '', // can be html or string
	dismissQueue: true, // If you want to use queue feature set this true
	template: '<div class="noty_message"><span class="noty_text"></span><div class="noty_close"></div></div>',
	animation: {
		open: 'animated fast flipInX',
		close: 'animated normal zoomOutDown',
		easing: 'linear',
		speed: 500 // opening & closing animation speed
	},
	timeout: 4000, // delay for closing event. Set false for sticky notifications
	force: false, // adds notification to the beginning of queue when set to true
	modal: false,
	maxVisible: 6, // you can set max visible notification for dismissQueue true option,
	killer: false, // for close all notifications before show
	closeWith: ['click'], // ['click', 'button', 'hover', 'backdrop'] // backdrop click will close all notifications
	callback: {
		onShow: function() {},
		afterShow: function() {},
		onClose: function() {},
		afterClose: function() {},
		onCloseClick: function() {},
	},
	container: {
		object  : '<ul id="noty_bottomCenter_layout_container" />',
		selector: 'ul#noty_bottomCenter_layout_container',
		style   : function() {
			$(this).css({
				bottom: 15,
				left : 0,
				position : 'fixed',
				width: '310px',
				height: 'auto',
				margin: 0,
				padding: 0,
				listStyleType: 'none',
				zIndex: 1000
			});

			$(this).css({
				left: ($(window).width() - $(this).outerWidth(false)) / 2 + 'px'
			});
		}
	},
	buttons: false // an array of buttons
};