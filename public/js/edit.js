define(function(require, exports, module) {

	var $ = require('jquery'),                //请求jquery类，保存一个局部变量$
		Backone = require('backbone');        //请求backbone类，保存一个局部变量Backbone

	//Backbone一般步骤

	//(1)新建一个Model模型类
	var Model = Backbone.Model.extend({});

	//(2)新建一个Collection集合类
	var Models = Backbone.Collection.extend({});

    //(3)新建一个插入一条数据的View视图类
	var View = Backbone.View.extend({

		//定义html模板
		template: _.template('<div class="control-group">'+
								'<label class="control-label" for="todo-tag"><%= name %></label>'+
								'<div class="controls"><input type="text" id="todo-<%= name %>" placeholder="tag" value=<%= value %>></div>'+
							'</div>'),   

		render: function(){
			var _html = this.template( this.model.toJSON()); //把当前模型中的数据格式化，然后传入到模板方法中，返回一个html段落
			this.$el.html(_html);   //   把html段落放到当前视图容器中，渲染完毕 
			return this;            //   返回当前视图对象
		}

	} );

	//(4)新建一个外围容器的View视图类
	var App = Backbone.View.extend({

			el: $('#editForm'),         //渲染到此容器中

			events : {


			},

			initialize: function() {

				this.models = new Models();  //创建一个collection实例

				this.models.on("add", this.addOne, this);  //为当前的collection实例绑定一个add事件，每次触发add事件，都回调一个视图中的add方法
				
				this.getTodo();  //从后台获取当前这条的todo数据

			},

			//添加单条数据
			addOne: function( model ){
				
				var _view = new View({model: model});  //创建一个插入一条数据的View实例，并把模型传入实例中
				
				this.$el.append( _view.render().el);  //当前视图容器添加单条数据view渲染好的el对象
			},

			//私有方法，按照既定规则，为当前对象排序；
			_sort : function(obj){
				var instance = {
					"title" : null,
					"tag" : null,
					"star" : null,
					"done" : null
				}
				for(var i in instance){
					instance[i] = obj[i];
				}
				return instance;
			},

			//根据传入的参数不同，来获取todo项
			getTodo: function(data) {
				var me = this;
				$.ajax({
					url: '/api/getTodo',
					type: 'POST',
					data: {
						id : _id
					},
					success: function(data, textStatus, jqXHR) {
						var _arr = [],
							_data = data[0];
						for(var i in _data){
							var _obj = {};
							_obj['name'] = i;
							_obj['value'] = _data[i];
							_arr.push(_obj);
						}
						_arr.forEach(function(todo) {       //forEach遍历数组对象
							me.models.add(todo);            //为视图中的collection添加一个json对象，它会触发视图中的addOne方法，
															//并且把json对象转成一个模型实例传入
						});
					},
					error: function(jqXHR, textStatus, errorThrown) {
						
					}
				});
			}	
		});

	//(5)创建一个app视图实例
	var app = new App();

	//发送一个请求到后台，更新当前的todo数据
	$('.edit_btn').click(function(){
		$.ajax({

			url: '/api/editTodo',
			type: 'PUT',
			data: {
				"title" : $("#todo-title").val(),
				"user" :  _userName,
				"star" :  $("#todo-star").val(),
				"done" :  $("#todo-done").val(),
				"tag"  :  $("#todo-tag").val(),
				"_id"  :  _id
			},
			success: function(data, textStatus, jqXHR) {
				if(data.resultCode == 0){
					alert('更新成功');
					window.location.replace('/todos');
				}
			}

		});

	});


});