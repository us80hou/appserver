define(function(require, exports, module) {
	
	var $ = require('jquery'),
		Backbone = require('backbone'),
		jForm = require('js/jquery.form');  

	/**
	 * Model Todo
	 * ------------------------------------------------------
	 */
	var Todo = Backbone.Model.extend({
		defaults: {
			star 	: false,
			tag 	: "",
			title 	: "",
			user 	: "",
			done 	: false
		}
	});

	/**
	 * Collection TodoList
	 * ------------------------------------------------------
	 */
	var TodoList = Backbone.Collection.extend({
		model: Todo
	});

	/**
	 * View Todo
	 * ------------------------------------------------------
	 */
	var TodoView = Backbone.View.extend({

		tagName: "tr",

		className: "animated fadeIn",

		template: 	'<td><%= title %></td>' +
					'<td><%= tag %></td>' +
					'<td><%= star %></td>' +
					'<td><%= done %></td>' +
					'<td><a href="/api/edit?id=<%= _id %>" class="btn btn-block btn-edit">编辑</a></td>' +
					'<td><a href="#" class="btn btn-block btn-danger btn-remove">删除</a></td>',

		events: {
			"click .btn-remove": "removeTodo"
		},

		initialize: function() {

		},

		render: function() {
			var me = this,
				tmpl = _.template(me.template);

			me.$el.html(tmpl(me.model.toJSON()));

			return this;
		},

		removeTodo: function() {
			var me = this;
			var todo = this.model.toJSON();
			
			$.ajax({
				url: '/api/removeTodo',
				type: 'POST',
				data: todo,
				success: function(data, textStatus, jqXHR) {
					if(data.resultCode === 0) {
						me.remove();
						alert('删除成功！');
					}
				},
				error: function(jqXHR, textStatus, errorThrown) {
					
				}
			})
		}

	});

	/**
	 * View TodoAppView
	 * ------------------------------------------------------
	 */
	var TodoAppView = Backbone.View.extend({

		el: "#todos-app",

		initialize: function() {
			this.$todosList = this.$(".todos-list");

			this.todoList = new TodoList();
			this.todoList.on("add", this.renderTodoItem, this);

			this.filterTodos({
				'user' : _userName
			});

		},

		renderTodoList: function() {
			var me = this;
			if(me.todoList.length === 0) {

			} else {
				_.each(me.todoList.models, function(item) {
					me.renderTodoItem(item);
				}, me);
			}
		},

		renderTodoItem: function(item) {
			var view = new TodoView({
				model: item
			});

			this.$todosList.append(view.render().el);
		},

		/**
		 * @method filterTodos
		 * 根据传入的参数不同，来获取todo项
		 */
		filterTodos: function(data) {
			var me = this;
			$.ajax({
				url: '/api/filterTodos',
				type: 'GET',
				data: data,
				success: function(data, textStatus, jqXHR) {
					data.forEach(function(todo) {
						me.todoList.add(new Todo(todo));
					});
				},
				error: function(jqXHR, textStatus, errorThrown) {
					
				}
			});
		}

	});

	var todoApp = window.todoApp = {};

	todoApp.todoAppView = new TodoAppView();



});