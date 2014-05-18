var glob = require('glob'),
    async = require('async'),
    fs = require('fs'),
    lib = require('./lib');

var concat = module.exports = function concat(pattern, options, callback) {
    if ('function' === typeof options) {
        callback = options;
        options = {};
    }
    async.waterfall([
        function (next) {
            if ('string' === typeof pattern) {
                glob(pattern, options, next);
            } else if (pattern instanceof Array) {
                next(null, pattern);
            } else {
                throw new Error('First argument must be a glob\'s pattern or an array of filepathes');
            }
        },
        function (files, next) {
            async.map(files, function (file, done) {
                fs.readFile(file, 'utf-8', function (err, content) {
                    if (err) {
                        return done(err);
                    }
                    done(null, lib.mapSource(content, file));
                });
            }, next);
        },
        function (list, next) {
            async.map(lib.sort(list), function (info, done) {
                fs.readFile(info.filename, done);
            }, next);
        },
        function (buffers, next) {
            next(null, Buffer.concat(buffers).toString('utf-8'));
        }
    ], callback);
};

concat.mapSource = lib.mapSource;

concat.sort = lib.sort;