
(function (ko) {

    var bindingConventions = function (underlyingProvider) {
        this.underlyingProvider = underlyingProvider;
        this.conventions = {};
    };

    bindingConventions.prototype = ko.utils.extend(new ko.bindingProvider(), {
        nodeHasBindings: function (node, bindingContext) {
            if (this.underlyingProvider.nodeHasBindings(node, bindingContext))
                return true;

            // See if at least one selector matches a convention
            var selector, selectors = this._getSelectorsForNode(node);
            for (var selectorIndex = 0; selector = selectors[selectorIndex]; selectorIndex++)
                if (this.conventions[selector])
                    return true;

            return false;
        },

        getBindings: function (node, bindingContext) {
            var bindings = this.underlyingProvider.getBindings(node, bindingContext);

            var selector, selectors = this._getSelectorsForNode(node);
            for (var selectorIndex = 0; selector = selectors[selectorIndex]; selectorIndex++)
                bindings = this._mergeInBindingsWithoutOverwrite(bindings, selector, bindingContext, node);

            return bindings;
        },

        addConventions: function (/* [rootSelector], */conventions) {
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

        addConvention: function (rootSelector, selector, bindingValueFunc) {
            var conventionsForSelector = this.conventions[selector];
            if (!conventionsForSelector)
                conventionsForSelector = this.conventions[selector] = [];

            conventionsForSelector.push({ rootSelector: rootSelector, bindingValue: bindingValueFunc });
        },

        _getSelectorsForNode: function (node) {
            var result = [];
            if (node.id)
                result.push("#" + node.id);
            if (node.className) {
                var classes = node.className.split(" ");
                for (var classIndex = 0, maxClassIndex = classes.length; classIndex < maxClassIndex; classIndex++) {
                    var singleClass = classes[classIndex];
                    if (singleClass)
                        result.push("." + singleClass);
                }
            }
            return result;
        },

        _mergeInBindingsWithoutOverwrite: function (existingBindings, selector, bindingContext, node) {
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
                            existingBindings = existingBindings || {};
                            existingBindings[bindingKey] = bindings[bindingKey];
                        }
                    }
                }
            }
            return existingBindings;
        },

        _nodeOrAncestorMatchesSelector: function (node, selector) {
            while (node) {
                if (this._nodeMatchesSelector(node, selector))
                    return true;
                node = node.parentNode;
            }
            return false;
        },

        _nodeMatchesSelector: function (node, selector) {
            var id = selector.charAt(0) === "#" ? selector.substring(1) : null;
            if (id)
                return node.id === id;
            var className = selector.charAt(0) === "." ? selector.substring(1) : null;
            if (className)
                return node.className && (ko.utils.arrayIndexOf(node.className.split(' '), className) >= 0);

            return false;
        }
    });

    ko.bindConventions = function (/* [rootSelector], */conventions) {
        if (!bindingConventions._activeInstance) {
            bindingConventions._activeInstance = new bindingConventions(ko.bindingProvider.instance);
            ko.bindingProvider.instance = bindingConventions._activeInstance;
        }
        bindingConventions._activeInstance.addConventions.apply(bindingConventions._activeInstance, arguments);
    };

})(ko);