/**
 * See more https://github.com/ariya/esprima and more https://github.com/galkinrost/astra
 * AST pattern to detect "angular.module" declaration
 * @type {{type: string, callee: {type: string, object: {type: string, name: string}, property: {type: string, name: string}}, arguments: Array}}
 */
var moduleAst = {
    type: 'CallExpression',
    callee: { type: 'MemberExpression',
        object: { type: 'Identifier', name: 'angular' },
        property: { type: 'Identifier', name: 'module' }
    },
    arguments: [
    ]
};

var templateAst = [
    {
        type: 'CallExpression',
        callee: { type: 'MemberExpression',
            object: { type: 'CallExpression'},
            property: { type: 'Identifier', name: 'directive' }
        },
        '**': {
            type: 'FunctionExpression',
            '**': {
                type: 'BlockStatement',
                '**': {
                    type: 'ReturnStatement',
                    '**': {
                        type: 'Property',
                        key: { type: 'Identifier', name: 'templateUrl' }
                    }
                }
            }
        }
    },
    {
        "type": "FunctionExpression",
        "params": [
            {
                "type": "Identifier",
                "name": "$routeProvider"
            }
        ],
        '**': {
            "type": "CallExpression",
            "callee": {
                "type": "MemberExpression",
                "property": {
                    "type": "Identifier",
                    "name": "when"
                }
            },
            '**': {
                type: 'Property',
                key: { type: 'Identifier', name: 'templateUrl' }
            }
        }
    }
];

/**
 *
 * @param source File's content
 * @param filename File's path
 * @returns {{modules: Array, dependencies: Array, templates: Array, filename: *, contents: *}}
 */
exports.mapSource = function mapSource(source, filename) {
    var astra = require('astra');
    var esprima = require('esprima');

    var ast = esprima.parse(source);

    var modules = [], dependencies = [], templates = [];

    astra(ast)
        .when(moduleAst, function (chunk) {
            if (chunk.arguments[1] && chunk.arguments[1].elements) {
                chunk.arguments[1].elements.forEach(function (element) {
                    if (element.value) {
                        dependencies.push(element.value);
                    }
                });
                if (chunk.arguments[0] && chunk.arguments[0].value) {
                    modules.push(chunk.arguments[0].value);
                }
            } else if (chunk.arguments[0] && chunk.arguments[0].value) {
                dependencies.push(chunk.arguments[0].value);
            }
        })
        .when(templateAst, function (chunk) {
            if (chunk.value.value)templates.push(chunk.value.value);
        }).run();

    for (var i in dependencies) {
        if (~modules.indexOf(dependencies[i])) {
            dependencies.splice(i, 1);
        }
    }

    return{
        modules: modules,
        dependencies: dependencies,
        templates: templates,
        filename: filename,
        contents: source
    };
};

/**
 * Sorting array of file's with angular application
 * @param arr [{
        modules: modules,
        dependencies: dependencies,
        templates: templates,
        filename: filename,
        contents: source
    }]
 * @returns {Array}
 */
exports.sort = function sort(arr) {

    function is(arr1, arr2) {
        for (var i in arr1) {
            if (~arr2.indexOf(arr1[i])) {
                return true;
            }
        }
        return false;
    }

    var sorted = [];

    for (var i in arr) {
        var index = 0, dependentIndex = sorted.length, dependencyIndex = 0, dependent = false, dependency = false;
        for (var ii = 0, length = sorted.length; ii < length; ii++) {
            var _dependent = false, _dependency = false;
            if (is(arr[i].modules, sorted[ii].dependencies) && ii < dependentIndex) {
                _dependent = dependent = true;
                dependentIndex = ii;
            }
            if (is(arr[i].dependencies, sorted[ii].modules) && ii >= dependencyIndex) {
                _dependency = dependency = true;
                dependencyIndex = ii + 1;
            }
            if (_dependency && _dependent) {
                throw new Error('Circular dependency in ' + arr[i].filename);
            }
        }
        if (dependency && dependent && dependentIndex < dependencyIndex) {
            throw new Error('Dependencies error ' + arr[i].filename);
        }

        if (dependency) {
            index = dependencyIndex;
        }

        if (dependent) {
            index = dependentIndex;
        }

        sorted.splice(index, 0, arr[i]);
    }

    return sorted;
};