# Knockout.bindConventions

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
 
Note:
This project is a fork of this script: 
http://code.google.com/p/jshost/source/browse/koBindingConventionsPrototype2.js?spec=svn81ac8ef7b4bbe30d00ac3a8c7a63987b1a94ced7&r=81ac8ef7b4bbe30d00ac3a8c7a63987b1a94ced7 