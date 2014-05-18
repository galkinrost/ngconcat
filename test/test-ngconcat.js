describe('Ngconcat', function () {
    var fs = require('fs'), test = require('./lib'), concat = require('../index'), glob = require('glob');

    describe('#build()', function () {
        it('src/examples/first', function (done) {
            concat('src/examples/first/**/*.js', function (err, result) {
                (err === null).should.be.ok;
                test.expect(result, 'expected/first.js');
                done();
            });
        });
        it('src/examples/complex', function (done) {
            concat('src/examples/complex/**/*.js', function (err, result) {
                (err === null).should.be.ok;
                test.expect(result, 'expected/complex.js');
                done();
            });
        });
        it('src/examples/complex with array argument', function (done) {
            glob('src/examples/complex/**/*.js', function (err, files) {
                if (err) {
                    return done(err);
                }
                concat(files, function (err, result) {
                    (err === null).should.be.ok;
                    test.expect(result, 'expected/complex.js');
                    done();
                });
            });

        });
    });
});