# Knockout.bindConventions

Alternative configuration mechanisms to bind html with [knockoutJs](http://knockoutjs.com/) ViewModel.
[Unobtrusive JavaScript](http://en.wikipedia.org/wiki/Unobtrusive_JavaScript)

before bindConventions :

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

	
Features
---
- ko.bindConventions can using with default data-bind attribute in html
- use element's attributes to build your bindConvention: 
		
ex:
	
	<div data-bind="with:person">
		<input type="hidden" name="Id">
		Name: <input type="text" name="Name">   <br>
		Date: <input type="text" name="Date">   <br>
		Email:<input type="email" name="Email"> <br>
	</div>
	<script>
		/* css selectors */
		ko.bindConventions({
			'input[name]' : function(person, element){ 
				return {value: person[element.name] };
			}
		});
		var vm = {
			person:ko.observable(
				{ Id : ko.observable(), Name:ko.observable(), Date:ko.observable(), Email:ko.observable() }
			)
		};
		ko.applyBindings(vm);
	</script>
	

Requirements
---
- Browser support or polyfills to document.querySelectorAll
 
 
Note:
This project is a fork of this script: 
http://code.google.com/p/jshost/source/browse/koBindingConventionsPrototype2.js?spec=svn81ac8ef7b4bbe30d00ac3a8c7a63987b1a94ced7&r=81ac8ef7b4bbe30d00ac3a8c7a63987b1a94ced7 
