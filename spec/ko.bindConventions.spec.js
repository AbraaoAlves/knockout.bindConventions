﻿///<reference path="libs/jquery-1.7.1.js" />
///<reference path="libs/jasmine.js" />
///<reference path="libs/jasmine-html.js" />
///<reference path="libs/jasmine-jquery.js" />
///<reference path="../libs/knockout-2.0.0.js" />

///<reference path="../ko.bindConventions.js" />



describe('Given html without attrs: data-bind', function () {

    var vm;
    var person = function (name) {
        this.Name = ko.observable(name);
    };

    beforeEach(function () {

        setFixtures('<div id="person">' +
                        '<span></span>' +
                        '<input type="text" class="Name" name="Name" >' +
                    '</div>');

    });

    it('throw error if browser no support "document.querySelectorAll"', function () {
        this.myFn = document.querySelectorAll;
        document.querySelectorAll = undefined;
        
        vm = new person();
            
        ko.bindConventions({
            '[id="person"]': function (p) { return { 'with': p }; },
            'input[name="Name"]': function (p) { return { value: p.Name }; },
            '#person span': function (p) { return { text: p.Id, visible: p.isCreated} }
        });

        expect(function(){
            ko.applyBindings(vm);
        }).toThrow('You can test ko.bindConventions standalone with: iPhone, FF3.5+, Safari4+ and IE8+\n\nTo run PURE on your browser, you need a JS library/framework with a CSS selector engine.');

        document.querySelectorAll = this.myFn;
        delete this.myFn;
    });

    describe('and data-bind conventions expecified', function () {
        var after = function () { };

        beforeEach(function () {
            vm = new person();
        });

        afterEach(function () {

            ko.applyBindings(vm, document.getElementById('jasmine-fixtures'));

            var inputName = $('#person').find('.Name');

            vm.Name('Jose');
            expect(inputName).toHaveValue('Jose');

            inputName.val('Joao').change();
            expect(vm.Name()).toEqual('Joao');

            if (after) after.call(this);
        });

        describe('when ko.applyBindings test have to be linked through conventions', function () {

            it('conventions based in "id" and "class"', function () {

                ko.bindConventions({
                    '#person': function (p) { return { 'with': p} },
                    '.Name': function (p) { return { value: p.Name }; }
                });

            });

            it('conventions based in css selector', function () {

                vm.Id = ko.observable();
                vm.isCreated = ko.computed(function () {
                    return this.Id() > 0;
                }, vm);

                ko.bindConventions({
                    '[id="person"]': function (p) { return { 'with': p }; },
                    'input[name="Name"]': function (p) { return { value: p.Name }; },
                    '#person span': function (p) { return { text: p.Id, visible: p.isCreated} }
                });

                after = function () {
                    vm.Id(1);
                    expect($('#person').find('span')).toBeVisible();

                    vm.Id(0);
                    expect($('#person').find('span')).not.toBeVisible();

                    after = null;
                } 

            });

            

        });

    });

});