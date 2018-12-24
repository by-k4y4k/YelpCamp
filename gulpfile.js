'use strict';

const gulp = require('gulp');
const sass = require('gulp-sass');
sass.compiler = require('node-sass');

gulp.task('sass', function() {
  return gulp
    .src('./assets/scss/**/*.scss')
    .pipe(sass({outputStyle: 'minified'}).on('error', sass.logError))
    .pipe(gulp.dest('./public/styles'));
});

gulp.task('sass:watch', function() {
  gulp.watch('./assets/scss/**/*.scss', ['sass']);
});
