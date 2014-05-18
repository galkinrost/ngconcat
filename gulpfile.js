var gulp = require('gulp'),
    jshint = require('gulp-jshint');

var files = [
    'test/**/*-test.js',
    '*.js'
];

gulp.task('jshint', function () {
    gulp.src(files)
        .pipe(jshint())
        .pipe(jshint.reporter('default'));
});

gulp.task('watch', function () {
    gulp.watch([files], ['jshint']);
});

