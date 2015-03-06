
/**
 * 注册页面
 */
define(function(require, exports, module) {
	
	var $ = require('jquery'),
		Backbone = require('backbone');

	var RegisterView = Backbone.View.extend({

		el : $(".signup"),

		initialize : function(){

		},

		events: {
			"click #register" : "registerForm"
		},

		registerForm : function(){

			var loginName = $('#username').val(),
				loginPass = $('#password').val();
				debugger;
			$.ajax({
				url: '/api/register',
				type: 'POST',
				data: {
					loginName: loginName,
					loginPass: loginPass
				},
				dataType: 'json',
				timeout: 60000,
				success: function(data, textStatus, jqXHR) {
					alert("恭喜你，注册成功!");
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

	var registerform = new RegisterView();

});