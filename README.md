# Knockout.bindingConventions

Alternative configuration mechanisms to bind html with [knockoutJs](http://knockoutjs.com/) ViewModel.


[Unobtrusive JavaScript](http://en.wikipedia.org/wiki/Unobtrusive_JavaScript)
---

after bindConventions :

	<div>
		<span data-bind="text:Id"></span>
		<input type="text" name="Name" data-bind="value:Name">
	</div>
	<script>
		ko.applyBindings({ Id : ko.observable(), Name:ko.observable()});
	</script>

with bindConventions :

	<div>
		<span></span>
		<input type="text" name="Name">
	</div>
	<script>
		/* css selectors */
		ko.bindConventions({
			'div span'		    :function(p){ return {text :p.Id }; },
			'div input[name="Name"]':function(p){ return {value:p.Name};}
		});
		ko.applyBindings({ Id : ko.observable(), Name:ko.observable()});
	</script>


Requirements
---
- Browser support or polyfills to document.querySelectorAll