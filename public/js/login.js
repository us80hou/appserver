define(function(require, exports, module) {
	
	var $ = require('jquery'),
		Backbone = require('backbone');

	var LoginView = Backbone.View.extend({

		el: "#login-app",

		initialize: function() {

		},

		events : {
			"submit #login-form" : "submitLoginForm"
		},

		submitLoginForm: function(event) {
			event.preventDefault ? event.preventDefault() : window.event.returnValue = false;
			var loginName = $('#login-name').val(),
				loginPass = $('#login-pass').val();
			$.ajax({
				url: '/api/loginIn',
				type: 'POST',
				data: {
					loginName: loginName,
					loginPass: loginPass
				},
				dataType: 'json',
				timeout: 60000,
				success: function(data, textStatus, jqXHR) {
					if(data.resultCode === 0) {
						window.location.replace('/todos');
					} else {
						switch(data.resultCode) {
							case 1000:
								alert(data.description);
						}
					}
				},
				error: function(jqXHR, textStatus, errorThrown) {}
			});

		}

	});

	var loginApp = new LoginView;

});