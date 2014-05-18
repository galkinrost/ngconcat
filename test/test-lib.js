describe('Lib', function () {
    var lib = require('../lib'),
        fs = require('fs');
    describe('#mapSource()', function () {
        it('module', function () {
            var source = fs.readFileSync('./src/module.js', 'utf8');
            JSON.stringify(lib.mapSource(source)).should.be.equal(JSON.stringify({
                modules: ['App'],
                dependencies: ['FirstModule', 'SecondModule'],
                templates: []
            }));
        });

        it('callee', function () {
            var source = fs.readFileSync('./src/callee.js', 'utf8');
            JSON.stringify(lib.mapSource(source)).should.be.equal(JSON.stringify({
                modules: [],
                dependencies: ['App'],
                templates: []
            }));
        });

        it('sufficient', function () {
            var source = fs.readFileSync('./src/sufficient.js', 'utf8');
            JSON.stringify(lib.mapSource(source)).should.be.equal(JSON.stringify({
                modules: ['FirstModule', 'App'],
                dependencies: [],
                templates: []
            }));
        });

        it('template', function () {
            var source = fs.readFileSync('./src/template.js', 'utf8');
            JSON.stringify(lib.mapSource(source)).should.be.equal(JSON.stringify({
                modules: [],
                dependencies: ['App.directives'],
                templates: ['/src/templates/directives/some_directive.html']
            }));
        });

        it('route', function () {
            var source = fs.readFileSync('./src/route.js', 'utf8');
            JSON.stringify(lib.mapSource(source)).should.be.equal(JSON.stringify({
                modules: ['App'],
                dependencies: ['ngRoute'],
                templates: ['book.html']
            }));
        });

        it('annotation', function () {
            var source = fs.readFileSync('./src/annotation.js', 'utf8');
            JSON.stringify(lib.mapSource(source)).should.be.equal(JSON.stringify({
                modules: ['App'],
                dependencies: ['App.directives', 'ngRoute'],
                templates: ['/src/templates/directives/some_directive.html', 'book.html']
            }));
        });
    });
    describe('#sort()', function () {
        it('sort', function () {
            var arr = [
                {
                    modules: ['App.services'],
                    dependencies: [],
                    templates: []
                },
                {
                    modules: ['App.directives'],
                    dependencies: [],
                    templates: []
                },
                {
                    modules: ['App.filters'],
                    dependencies: [],
                    templates: []
                },
                {
                    modules: ['Module.directives'],
                    dependencies: [],
                    templates: []
                },
                {
                    modules: ['Module.filters'],
                    dependencies: [],
                    templates: []
                },
                {
                    modules: ['Module'],
                    dependencies: ['Module.services', 'Module.filters', 'Module.directives', 'Module.controllers', 'SecondModule'],
                    templates: []
                },
                {
                    modules: ['Module.services'],
                    dependencies: [],
                    templates: []
                },
                {
                    modules: ['App'],
                    dependencies: ['App.services', 'App.directives', 'App.filters', 'Module'],
                    templates: []
                },
                {
                    modules: ['Module.controllers'],
                    dependencies: [],
                    templates: []
                }
            ];

            var expected = [
                {
                    modules: [ 'Module.filters' ],
                    dependencies: [],
                    templates: []
                },
                {
                    modules: [ 'Module.directives' ],
                    dependencies: [],
                    templates: []
                },
                {
                    modules: [ 'Module.services' ],
                    dependencies: [],
                    templates: []
                },
                {
                    modules: [ 'Module.controllers' ],
                    dependencies: [],
                    templates: []
                },
                {
                    modules: [ 'Module' ],
                    dependencies: [ 'Module.services',
                        'Module.filters',
                        'Module.directives',
                        'Module.controllers',
                        'SecondModule' ],
                    templates: []
                },
                {
                    modules: [ 'App.filters' ],
                    dependencies: [],
                    templates: []
                },
                {
                    modules: [ 'App.directives' ],
                    dependencies: [],
                    templates: []
                },
                {
                    modules: [ 'App.services' ],
                    dependencies: [],
                    templates: []
                },
                {
                    modules: [ 'App' ],
                    dependencies: [ 'App.services', 'App.directives', 'App.filters', 'Module' ],
                    templates: []
                }
            ];

            JSON.stringify(lib.sort(arr)).should.be.equal(JSON.stringify(expected));
        });

        it('circular dependency', function () {
            var arr = [
                {
                    modules: ['App'],
                    dependencies: ['Module']
                },
                {
                    modules: ['Module'],
                    dependencies: ['App']
                }
            ], err;

            try {
                lib.sort(arr);
            } catch (_err) {
                err = _err.message;
            }

            err.should.be.equal('Circular dependency');
        });
    });

});