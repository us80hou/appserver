seajs.config({
	plugins: ['shim'],
	alias: {
		'jquery': {
			src: '/lib/js/jquery.min.js',
			exports: 'jQuery'
		},

		'underscore': {
			src: '/lib/js/underscore.js',
			exports: '_'
		},

		'backbone': {
			src: '/lib/js/backbone.js',
			deps: ['underscore', 'jquery'],
			exports: 'Backbone'
		},

		'backbone.localStorage': {
			src: '/lib/js/backbone-localstorage.js',
			deps: ['backbone']
		},

		'json2': {
			src: '/lib/js/json2.js',
			exports: 'json2'
		}
	}
})