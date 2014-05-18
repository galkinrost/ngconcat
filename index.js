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
            glob(pattern, options, next);
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

concat.sync = function (pattern, options) {

};