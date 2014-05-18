describe('Ngconcat', function () {
    var fs = require('fs'), test = require('./lib'), concat = require('../index');

    describe('#build()', function () {
        it('src/examples/first', function (done) {
            concat('src/examples/first/**/*.js', function (err, result) {
                (err === null).should.be.ok;
                test.expect(result, 'expected/first.js');
                done();
            });
        });
    });
});