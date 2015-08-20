var gulp = require('gulp'),
    plumber = require('gulp-plumber'),
    concat = require('gulp-concat'),
    cache = require('gulp-cache'),
    notify = require('gulp-notify'),
    sourcemaps = require('gulp-sourcemaps'),
    uglify = require('gulp-uglify'),
    sass = require('gulp-sass'),
    autoprefixer = require('gulp-autoprefixer'),
    minifycss = require('gulp-minify-css');


/* Styles */
// App, includes Foundation and site
gulp.task('styles.app', function(){
  gulp.src([
      'sass/*.sass',
      'sass/*.scss'
    ])
    .pipe(sourcemaps.init()) // for dev
    .pipe(plumber({ errorHandler: notify.onError("<%= error.message %>") }))

    .pipe(sass())
    .pipe(autoprefixer('last 4 versions'))
    .pipe(minifycss())

    .pipe(sourcemaps.write()) // for dev
    .pipe(gulp.dest('css/'))
});


/* Perform tasks */
gulp.task('watch', function(){
  gulp.watch([
    'sass/**/*.sass',
    'sass/**/*.scss'
  ], ['styles.app']);
});

gulp.task('default', [
  'watch',
  'styles.app'
]);