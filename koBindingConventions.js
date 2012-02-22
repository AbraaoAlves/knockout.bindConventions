///<reference path="libs/knockout-2.0.0" />
(function(ko){
    
    var contains = /*bool*/ function(el){
        return Array.prototype.indexOf.call(this, el) !== -1; 
    },
    find = /*nodeList*/ function(selector, context){
        context = context || document;
        return context.querySelectorAll(selector);
    },

    bindingConventions = function(underlyingProvider) {
	    this.underlyingProvider = underlyingProvider;
	    this.conventions = { };
	};

	bindingConventions.prototype = ko.utils.extend(new ko.bindingProvider(), {
	    nodeHasBindings: function(node, bindingContext) {
	        if (this.underlyingProvider.nodeHasBindings(node, bindingContext))
	            return true;

            for(var selector in this.conventions)
                if (contains.call(find(selector), node))
	                return true;

	        return false;
	    },

	    getBindings: function(node, bindingContext) {
	        var bindings = this.underlyingProvider.getBindings(node, bindingContext);

	        for(var selector in this.conventions)
                if(contains.call(find(selector, rootEl), node))
                    bindings = this._mergeInBindingsWithoutOverwrite(bindings, selector, bindingContext, node);
            
	        return bindings;
	    },

	    addConventions: function(/* [rootSelector], */ conventions) {
	        var rootSelector;
	        if (arguments.length > 1) {
	            rootSelector = arguments[0];
	            conventions = arguments[1];
	        }

	        for (var key in conventions) {
	            if (conventions.hasOwnProperty(key)) {
	                this.addConvention(rootSelector, key, conventions[key]);
	            }
	        }
	    },

	    addConvention: function(rootSelector, selector, bindingValueFunc) {
	        var conventionsForSelector = this.conventions[selector];
	        if (!conventionsForSelector)
	            conventionsForSelector = this.conventions[selector] = [];

	        conventionsForSelector.push({ rootSelector: rootSelector, bindingValue: bindingValueFunc });
	    },

	    _mergeInBindingsWithoutOverwrite: function(existingBindings, selector, bindingContext, node) {
	        var conventionsForSelector = this.conventions[selector];
	        if (conventionsForSelector) {
	            for (var i = 0, j = conventionsForSelector.length; i < j; i++) {
	                var conventionsEntry = conventionsForSelector[i];
	                var bindings = typeof conventionsEntry.bindingValue === "function"
	                    ? conventionsEntry.bindingValue(bindingContext['$data'], bindingContext)
	                    : conventionsEntry.bindingValue;
	                if (conventionsEntry.rootSelector && !this._nodeOrAncestorMatchesSelector(node, conventionsEntry.rootSelector))
	                    continue;

	                for (var bindingKey in bindings) {
	                    if (bindings.hasOwnProperty(bindingKey) && ((!existingBindings) || (!existingBindings.hasOwnProperty(bindingKey)))) {
	                        existingBindings = existingBindings || { };
	                        existingBindings[bindingKey] = bindings[bindingKey];
	                    }
	                }
	            }
	        }
	        return existingBindings;
	    },

	    _nodeOrAncestorMatchesSelector: function(node, selector) {
	        while (node) {
	            if (contains.call(find(selector), node))
                    return true;
	            node = node.parentNode;
	        }
	        return false;
	    }
	
    });

	ko.bindConventions = function(/* [rootSelector], */ conventions) {
	    if (!bindingConventions._activeInstance) {
	        bindingConventions._activeInstance = new bindingConventions(ko.bindingProvider.instance);
	        ko.bindingProvider.instance = bindingConventions._activeInstance;
	    }
	    bindingConventions._activeInstance.addConventions.apply(bindingConventions._activeInstance, arguments);
    };

    ko.clearBindConventions = function(){
        if(bindingConventions._activeInstance){
            ko.bindingProvider.instance = bindingConventions._activeInstance.underlyingProvider;
            delete bindingConventions._activeInstance;
        }
    };

})(ko);

