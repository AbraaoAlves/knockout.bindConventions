///<reference path="libs/jquery-1.7.1.js" />
///<reference path="libs/jasmine.js" />
///<reference path="libs/jasmine-html.js" />
///<reference path="libs/jasmine-jquery.js" />
///<reference path="../libs/knockout-2.0.0.js" />

///<reference path="../koBindingConventions.js" />

var person = function(){
    this.Name = ko.observable();
};

describe('Given html without attrs: data-bind', function(){
    var didInit = false;
    
    beforeEach(function(){
        
        setFixtures('<div id="person">'+
                        '<input type="text" class="Name" name="Name" >'+
                    '</div>');

    });

    afterEach(function(){
        didInit = false;
    });

    describe('and data-bind conventions expecified', function(){
        var vm;
        beforeEach(function(){
            
            vm = new person();
            ko.bindingHandlers.test = {
                init: function (element, valueAccessor, allBindingsAccessor, viewModel) {
            
                    expect(element.className).toBe("Name");
                    expect(viewModel).toBe(vm);
                    
                    didInit = true;
                }
            };
        });

        describe('when ko.applyBindings test have to be linked through conventions', function(){
            
            it('to conventions based in "id" and "class"', function(){
                
                ko.bindConventions('#person',{
                    '#person' : {'with':vm},
                    '.Name':function(p){ return {test: p.Name}; }
                });

                ko.applyBindings(vm);
                expect(didInit).toBe(true);

            });
            
        });
                
    });

});
