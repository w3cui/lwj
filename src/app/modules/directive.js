!(function(win,lwjui){

	lwjui.directive('ui-layer', function () {
		return {	
			template:"<div>我是第一个组件：</div>",
			uses:"box",
			scope:{
                string: 'selecteda',
                object: '=list',
            },
			link: function (el) {
				var scope = el.scope;
				var tpl = $(el.template).append("（我是属性值："+scope.string+")");
				el.element.html(tpl);
			}
		};
	}).directive('ui-attr', function () {
		return {
			template:"<div>我是第二个组件：</div>",	
			uses:"form",
			scope:{
                string: 'selecteda',
                object: '=list',
            },
			link: function (el) {
				var scope = el.scope;
				var tpl = $(el.template).append("（我是属性值："+scope.string+")");
				el.element.html(tpl);
			}
		};
	});

})(window,lwjui);