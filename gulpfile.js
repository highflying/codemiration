var gulp = require('gulp');
var cssnano = require('gulp-cssnano');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var sass = require('gulp-sass');

gulp.task('default', ['minify-css', 'build-js']);

gulp.task('compile-sass', function () {
  return gulp
    .src('sass/**/*.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest('./static/css'));
});

gulp.task('sass:watch', function () {
  gulp.watch('./sass/**/*.scss', ['minify-css']);
});

gulp.task('minify-css', ['compile-sass'], function () {
  return gulp
    .src('./static/css/screen.css')
    .pipe(cssnano())
    .pipe(concat('all.css'))
    .pipe(gulp.dest('./static/css'));
});

gulp.task('build-js', function () {
  return gulp
    .src([
      './bower_components/jquery/dist/jquery.min.js',
      './bower_components/bootstrap-sass-official/javascripts/bootstrap.min.js'
    ])
    .pipe(uglify())
    .pipe(concat('all.js'))
    .pipe(gulp.dest('./static/js'));
});
