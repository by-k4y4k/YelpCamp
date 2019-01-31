'use strict';

const gulp = require('gulp');
const sass = require('gulp-sass');
const autoprefixer = require('gulp-autoprefixer');
const less = require('gulp-less');

sass.compiler = require('node-sass');

gulp.task('sass', function() {
  return gulp
    .src('./assets/scss/**/*.scss')
    .pipe(sass({outputStyle: 'expanded'}).on('error', sass.logError))
    .pipe(
      autoprefixer({
        browsers: ['>1%', 'not dead'],
        cascade: false,
      })
    )
    .pipe(gulp.dest('./public/styles'));
});

/*
 * LESS to compile bootstrap 3.3.7, should only need this once but it's still
 * good practice for writing gulp tasks
 * TODO: Update to newest Bootstrap
 * REVIEW: The course has a prior section about Bootstrap: maybe this (YelpCamp)
 * would be a good excuse to learn/practise Semantic?
 */

gulp.task('less', function() {
  return gulp
    .src('./node_modules/bootstrap/less/bootstrap.less')
    .pipe(less())
    .pipe(gulp.dest('./public/styles'));
});

// TODO: minify and concatenate CSS
