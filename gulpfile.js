'use strict';

var gulp = require('gulp');
var plugins = require('gulp-load-plugins')({
  pattern: [
    'gulp-*',
    'gulp.*',
    '@*/gulp{-,.}*',
    'postcss-*',
    'css-*',
    'del',
    'precss',
    'autoprefixer',
    'browser-sync',
    'yargs',
    'run-sequence',
  ],
});

gulp.task('clean', function () {
  return plugins.del('build');
});

gulp.task('clean:dev', function () {
  return plugins.del('js/main.js', 'img/symbols.svg', 'css/style.css');
});

gulp.task('style', function () {
  return gulp
    .src('postcss/style.css')
    .pipe(plugins.changed('build/css'))
    .pipe(plugins.plumber())
    .pipe(plugins.postcss([
      plugins.precss(),
      plugins.cssMqpacker({
        sort: true,
      }),
      plugins.autoprefixer({
        browsers: ['last 4 versions'],
      }),
      plugins.postcssFlexbugsFixes(),
    ]))
    .pipe(plugins.csscomb())
    .pipe(plugins.csso({
      restructure: true,
      forceMediaMerge: true,
      structureMinimazation: true,
      comments: false,
    }))
    .pipe(gulp.dest('build/css'));
});

gulp.task('style:dev', function () {
  return gulp
    .src('postcss/style.css')
    .pipe(plugins.changed('css'))
    .pipe(plugins.plumber())
    .pipe(plugins.sourcemaps.init())
    .pipe(plugins.sourcemaps.identityMap())
    .pipe(plugins.postcss([
      plugins.precss(),
      plugins.autoprefixer({
        browsers: ['last 4 versions'],
      }),
      plugins.postcssFlexbugsFixes(),
      plugins.postcssSorting(),
      plugins.postcssReporter({
        clearReportedMessages: 'true',
      }),
    ]))
    .pipe(plugins.sourcemaps.write())
    .pipe(gulp.dest('css'))
    .pipe(plugins.plumber.stop())
    .pipe(plugins.browserSync.stream());
});

gulp.task('htmlminify', function () {
  return gulp
    .src('*.html')
    .pipe(plugins.changed('build/*.html'))
    .pipe(plugins.htmlMinifier2({
      collapseWhitespace: true
    }))
    .pipe(gulp.dest('build/'));
});

gulp.task('jsmin', function () {
  return gulp.src(['js/utils.js'])
    .pipe(plugins.uglify())
    .pipe(gulp.dest('build/js'));
});

gulp.task('concat:dev', function () {
  return gulp.src(['js/utils.js', 'js/map.js'])
    .pipe(plugins.concat('main.js'))
    .pipe(gulp.dest('js'))
    .pipe(server.stream());
});

gulp.task('images', function () {
  return gulp.src('img/*.{png,jpg,gif}')
    .pipe(plugins.newer('img'))
    .pipe(plugins.imagemin([
      plugins.imagemin.optipng({
        optimizationLevel: 3
      }),
      plugins.imagemin.jpegtran({
        progressive: true
      })
    ]))
    .pipe(gulp.dest('img'));
});

gulp.task('symbols:dev', function () {
  return gulp.src('img/icons/*.svg')
    .pipe(plugins.svgmin())
    .pipe(plugins.svgstore({
      inlineSvg: true
    }))
    .pipe(plugins.rename('symbols.svg'))
    .pipe(gulp.dest('img/'));
});

gulp.task('symbols', function () {
  return gulp.src('img/icons/*.svg')
    .pipe(plugins.newer('build/img'))
    .pipe(plugins.svgmin())
    .pipe(plugins.svgstore({
      inlineSvg: true
    }))
    .pipe(plugins.rename('symbols.svg'))
    .pipe(gulp.dest('build/img'));
});

gulp.task('svg', function () {
  return gulp.src('img/**/*.svg')
    .pipe(plugins.svgmin())
    .pipe(gulp.dest('img/'));
});

gulp.task('copy', function () {
  return gulp.src([
      'fonts/*.{woff,woff2}',
      'img/*.{svg,png,jpg,gif}'
    ], {
      base: '.'
    })
    .pipe(gulp.dest('build'));
});

gulp.task('html:copy', function () {
  return gulp
    .src('*.html')
    .pipe(plugins.changed('*.html'))
    .pipe(gulp.dest('build'));
});

gulp.task('html:update', ['html:copy'], function (done) {
  plugins.browserSync.reload();
  done();
});

gulp.task('server', ['clean', 'style:dev'], function () {
  plugins.browserSync.init({
    server: '.',
    notify: false,
    open: true,
    cors: true,
    ui: false
  });

  gulp.watch('postcss/**/*.css', function () {
    plugins.runSequence(
      'clean:dev', ['style:dev']
    );
  });
  gulp.watch('*.html', ['html:update']);
});

gulp.task('build', function (fn) {
  plugins.runSequence(
    'clean', ['copy', 'style', 'htmlminify', 'jsmin'],
    fn
  );
});

gulp.task('demo', function () {
  plugins.browserSync.init({
    server: 'build',
    notify: false,
    open: true,
    cors: true,
    ui: false,
  });
});

gulp.task('deploy', function () {
  return gulp.src('./build/**/*')
    .pipe(plugins.ghPages());
});
