'use strict';

var gulp = require('gulp');
var plugins = require('gulp-load-plugins')({
  pattern: [
    'gulp-*',
    'gulp.*',
    '@*/gulp{-,.}*',
    'postcss-*',
    'rollup-*',
    'css-*',
    'del',
    'precss',
    'autoprefixer',
    'browser-sync',
    'run-sequence',
    'stream-combiner2',
    'critical',
  ],
});

var isDevelopment =
  !process.env.NODE_ENV || process.env.NODE_ENV === 'development';

gulp.task('clean', function() {
  return plugins.del('build');
});

gulp.task('clean:css', function() {
  return plugins.del('build/css/style.css');
});

gulp.task('clean:js', function() {
  return plugins.del('build/js/main.js');
});

gulp.task('style', function() {
  return gulp
    .src('postcss/style.css')
    .pipe(plugins.changed('build/css'))
    .pipe(plugins.plumber())
    .pipe(plugins.if(isDevelopment, plugins.sourcemaps.init()))
    .pipe(plugins.if(isDevelopment, plugins.sourcemaps.identityMap()))
    .pipe(
      plugins.postcss([
        plugins.postcssImport(),
        plugins.postcssPresetEnv({
          stage: 0,
        }),
        plugins.cssMqpacker({
          sort: true,
        }),
        plugins.autoprefixer(),
        plugins.postcssFlexbugsFixes(),
        plugins.postcssSorting(),
      ]),
      plugins.if(
        !isDevelopment,
        plugins.postcss(
          plugins.postcssUrl({
            url: 'rebase',
          })
        )
      )
    )
    .pipe(plugins.if(isDevelopment, plugins.sourcemaps.write()))
    .pipe(
      plugins.if(
        !isDevelopment,
        plugins.csso({
          restructure: true,
          forceMediaMerge: true,
          structureMinimazation: true,
          comments: false,
        })
      )
    )
    .pipe(plugins.if(!isDevelopment, plugins.rev()))
    .pipe(
      plugins.if(
        !isDevelopment,
        plugins.revReplace({
          manifest: gulp.src('build/manifest/manifest.json'),
        })
      )
    )
    .pipe(gulp.dest('build/css'))
    .pipe(plugins.if(isDevelopment, plugins.plumber.stop()))
    .pipe(
      plugins.if(
        !isDevelopment,
        plugins.rev.manifest('build/manifest/manifest.json', {
          base: 'build/manifest',
          merge: true,
        })
      )
    )
    .pipe(plugins.if(!isDevelopment, gulp.dest('build/manifest')))
    .pipe(plugins.if(isDevelopment, plugins.browserSync.stream()));
});

gulp.task('scripts', function() {
  return gulp
    .src('js/main.js')
    .pipe(plugins.plumber())
    .pipe(plugins.if(isDevelopment, plugins.sourcemaps.init()))
    .pipe(
      plugins.betterRollup(
        {
          plugins: [
            plugins.rollupPluginNodeResolve({
              browser: true,
            }),
            plugins.rollupPluginCommonjs(),
            plugins.rollupPluginBabel({
              babelrc: true,
              exclude: 'node_modules/**',
              presets: [
                [
                  'env',
                  {
                    modules: false,
                  },
                ],
              ],
              plugins: ['external-helpers'],
            }),
          ],
        },
        'iife'
      )
    )
    .pipe(plugins.if(!isDevelopment, plugins.uglify()))
    .pipe(plugins.if(isDevelopment, plugins.sourcemaps.write('')))
    .pipe(plugins.if(!isDevelopment, plugins.rev()))
    .pipe(gulp.dest('build/js'))
    .pipe(
      plugins.if(
        !isDevelopment,
        plugins.rev.manifest('build/manifest/manifest.json', {
          base: 'build/manifest',
          merge: true,
        })
      )
    )
    .pipe(plugins.if(!isDevelopment, gulp.dest('build/manifest')));
});

gulp.task('symbols', function() {
  return gulp
    .src('img/icons/*.svg')
    .pipe(plugins.if(!isDevelopment, plugins.newer('build/img')))
    .pipe(plugins.svgmin())
    .pipe(
      plugins.svgstore({
        inlineSvg: true,
      })
    )
    .pipe(plugins.rename('symbols.svg'))
    .pipe(plugins.if(isDevelopment, plugins.rev()))
    .pipe(plugins.if(isDevelopment, gulp.dest('img/'), gulp.dest('build/img')));
});

gulp.task('images', function() {
  return gulp
    .src('img/*.{png,jpg,gif}')
    .pipe(plugins.newer('img'))
    .pipe(
      plugins.imagemin([
        plugins.imagemin.optipng({
          optimizationLevel: 3,
        }),
        plugins.imagemin.jpegtran({
          progressive: true,
        }),
      ])
    )
    .pipe(gulp.dest('img'));
});

gulp.task('htmlminify', function() {
  return gulp
    .src('*.html')
    .pipe(plugins.changed('build/*.html'))
    .pipe(
      plugins.htmlMinifier2({
        collapseWhitespace: true,
      })
    )
    .pipe(gulp.dest('build/'));
});

gulp.task('svg', function() {
  return gulp
    .src('img/**/*.svg')
    .pipe(plugins.svgmin())
    .pipe(gulp.dest('img/'));
});

gulp.task('copy', function() {
  return gulp
    .src(['fonts/*.{woff,woff2}', 'img/*.{svg,png,jpg,gif}'], {
      base: '.',
    })
    .pipe(plugins.if(!isDevelopment, plugins.rev()))
    .pipe(gulp.dest('build/'))
    .pipe(plugins.if(!isDevelopment, plugins.rev.manifest('manifest.json')))
    .pipe(plugins.if(!isDevelopment, gulp.dest('build/manifest')));
});

gulp.task('html:copy', function() {
  return gulp
    .src('*.html')
    .pipe(plugins.changed('*.html'))
    .pipe(gulp.dest('build'));
});

gulp.task('html:update', ['html:copy'], function(done) {
  plugins.browserSync.reload();
  done();
});

gulp.task('server', ['style'], function(fn) {
  plugins.browserSync.init({
    server: './build',
    notify: false,
    open: true,
    cors: true,
    ui: false,
  });

  gulp.watch('postcss/**/*.css', function() {
    plugins.runSequence('clean:css', ['style']);
  });

  gulp.watch('js/**/*.js', function() {
    plugins.runSequence('clean:js', ['scripts']);
  });

  gulp.watch('*.html', ['html:update']);
});

gulp.task('build', function(fn) {
  plugins.runSequence('clean', 'copy', ['style', 'scripts'], 'htmlminify', fn);
});

gulp.task('demo', function() {
  plugins.browserSync.init({
    server: './build',
    notify: false,
    open: true,
    cors: true,
    ui: false,
  });
});

gulp.task('deploy', function() {
  return gulp.src('./build/**/*').pipe(plugins.ghPagesWill());
});

gulp.task('dev', function(fn) {
  plugins.runSequence(
    'clean',
    'copy',
    'html:copy',
    'style',
    'scripts',
    'server',
    fn
  );
});
