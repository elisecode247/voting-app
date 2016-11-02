// guide: https://c9.io/blog/browsersync-gulp-js-cloud9/

var gulp = require('gulp'),

  browserSync = require('browser-sync'),

  sass = require('gulp-sass');

gulp.task('sass', function() {
  return gulp.src('./app/sass/*.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest('./public/css'))
    .pipe(browserSync.reload({stream: true}));
});

gulp.task('sass:watch', function() {
  gulp.watch('./app/sass/*.scss', ['sass']);
});

gulp.task('browser-sync', function() {

  browserSync({

    files: 'app/**/*.js, app/sass/*.scss',

    port: 8082

  });
});

gulp.task('default', ['sass:watch', 'browser-sync']);


