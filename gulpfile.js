var gulp      = require("gulp");
var minifyCSS = require("gulp-minify-css");
var concat    = require("gulp-concat");
var compass   = require("gulp-compass");
var uglify    = require('gulp-uglify');


gulp.task("default", ["minify-css", "build-js"]);

gulp.task("compile-sass", function () {
  return gulp
    .src("sass/*.scss")
    .pipe(compass({
      config_file: "./config.rb",
      css:         "static/css",
      sass:        "sass",
    }))
    .pipe(gulp.dest("./static/css"));
});

gulp.task("minify-css", ["compile-sass"], function() {

  return gulp
    .src("./static/css/screen.css")
    .pipe(
      minifyCSS({
        relativeTo: "./static",
      })
    )
    .pipe(concat("all.css"))
    .pipe(gulp.dest("./static/css"));
});

gulp.task("build-js", function() {
  return gulp
    .src([
      "./bower_components/jquery/dist/jquery.min.js",
      "./bower_components/bootstrap-sass-official/javascripts/bootstrap.min.js",
    ])
    .pipe(uglify())
    .pipe(concat("all.js"))
    .pipe(gulp.dest("./static/js"));
});
