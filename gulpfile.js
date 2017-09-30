'use strict';

var gulp = require('gulp');
var plumber = require('gulp-plumber');
var postcss = require('gulp-postcss');
var precss = require('precss');
var rename = require('gulp-rename');
var svgstore = require('gulp-svgstore');
var svgmin = require('gulp-svgmin');
var autoprefixer = require('autoprefixer');
var mqpacker = require('css-mqpacker');
var csso = require('gulp-csso');
var imagemin = require('gulp-imagemin');
var htmlmin = require('gulp-html-minifier2');
var concat = require('gulp-concat');
var del = require('del');
var run = require('run-sequence');
var uglify = require('gulp-uglify');
var ghPages = require('gulp-gh-pages');
var server = require('browser-sync').create();


gulp.task('clean', function() {
  return del('build');
});

gulp.task('clean:dev', function() {
  return del('js/main.js', 'img/symbols.svg');
});

gulp.task('style', function() {
  return gulp.src('postcss/style.css')
  .pipe(plumber())
  .pipe(postcss([
    precss(),
    mqpacker({
      sort: false
    }),
    autoprefixer({browsers: [
      'last 2 versions'
    ]})
  ]))
  .pipe(csso())
  .pipe(gulp.dest('build/css'));
});

gulp.task('style:dev', function() {
  return gulp.src('postcss/style.css')
  .pipe(plumber())
  .pipe(postcss([
    precss(),
    autoprefixer({browsers: [
      'last 2 versions'
    ]})
  ]))
  .pipe(gulp.dest('css'))
  .pipe(server.stream());
});


gulp.task('htmlminify', function() {
  return gulp.src('*.html')
  .pipe(htmlmin({collapseWhitespace: true}))
  .pipe(gulp.dest('build/'));
});

gulp.task('jsmin', function() {
  return gulp.src(['js/utils.js', 'js/map.js'])
  .pipe(concat('main.js'))
  .pipe(uglify())
  .pipe(gulp.dest('build/js'));
});

gulp.task('concat:dev', function() {
  return gulp.src(['js/utils.js', 'js/map.js'])
  .pipe(concat('main.js'))
  .pipe(gulp.dest('js'))
  .pipe(server.stream());
});

gulp.task('images', function() {
  return gulp.src('img/**/*.{png,jpg,gif}')
  .pipe(imagemin([
    imagemin.optipng({optimizationLevel: 3}),
    imagemin.jpegtran({progressive: true})
  ]))
  .pipe(gulp.dest('img'));
});

gulp.task('symbols:dev', function() {
  return gulp.src('img/icons/*.svg')
  .pipe(svgmin())
  .pipe(svgstore({
    inlineSvg: true
  }))
  .pipe(rename('symbols.svg'))
  .pipe(gulp.dest('img/'));
});

gulp.task('symbols', function() {
  return gulp.src('img/icons/*.svg')
  .pipe(svgmin())
  .pipe(svgstore({
    inlineSvg: true
  }))
  .pipe(rename('symbols.svg'))
  .pipe(gulp.dest('build/img'));
});

gulp.task('svg', function() {
  return gulp.src('img/*.svg')
  .pipe(svgmin())
  .pipe(gulp.dest('img/'));
});

gulp.task('copy', function() {
  return gulp.src([
    'fonts/*.{woff,woff2}',
    'img/*.{svg,png,jpg,gif}'
  ], {
    base: '.'
  })
  .pipe(gulp.dest('build'));
});

gulp.task('html:copy', function() {
  return gulp.src('*.html')
  .pipe(gulp.dest('build'));
});

gulp.task('html:update', ['html:copy'], function(done) {
  server.reload();
  done();
});

gulp.task('serve', ['clean:dev','style:dev', 'concat:dev', 'symbols:dev'], function() {
  server.init({
    server: '.',
    notify: false,
    open: true,
    cors: true,
    ui: false
  });

  gulp.watch('postcss/**/*.css', ['style:dev']);
  gulp.watch('*.html', ['html:update']);
});

gulp.task('build', function(fn) {
  run(
    'clean',
    ['copy', 'style', 'htmlminify', 'jsmin', 'symbols'],
    fn
  );
});

gulp.task('demo', function() {
  server.init({
    server: 'build',
    notify: false,
    open: true,
    cors: true,
    ui: false
  });
});

gulp.task('deploy', function() {
  return gulp.src('./build/**/*')
    .pipe(ghPages());
});
