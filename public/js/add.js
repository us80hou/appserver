define(function(require, exports, module) {
	
	var $ = require('jquery');

	$(".add_btn").click(function() {
		var title = $("#todo-title").val(),
			user = $("#todo-user").val(),
			star = $("#todo-title").val(),
			done = $("#todo-done").val(),
			tag = $("#todo-tag").val();

		$.ajax({
			url: "/api/addTodo",
			type: "POST",
			data: {
				title: title,
				user: _userName,
				star: star,
				done: done,
				tag: tag
			},
			success: function(data, textStatus, jqXHR) {
				if(data.resultCode === 0) {
					alert("添加成功");
					window.location.replace('/todos');
				}
			},
			error: function(jqXHR, textStatus, errorThrown) {
					
			}
		})


	});


});