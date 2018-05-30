var gulp          = require('gulp');
var sass          = require('gulp-sass');
var browserSync   = require('browser-sync');
var reload        = browserSync.reload;
var cleanCSS      = require('gulp-clean-css');
var autoprefixer  = require('gulp-autoprefixer');
var uglify        = require('gulp-uglify');
// var jsmin        = require('gulp-jsmin');
var rename        = require('gulp-rename');
var pump          = require('pump');

gulp.task('sass',function(){
  return gulp.src('src/static/scss/*.scss')
    .pipe(sass())
    .pipe(autoprefixer({
      browsers: ['last 2 versions', 'ie > 8']
    }))
    .pipe(cleanCSS())
    .pipe(gulp.dest('src/static/css'))
    .pipe(reload({stream: true}));
});

gulp.task('js', function (cb) {

  pump([
    gulp.src('src/static/js/*.js'),
    uglify(),
    rename({suffix: '.min'}),
    gulp.dest('src/static/jsmin')
  ], cb)
})

gulp.task('dev', ['sass', 'js'], function(){
  browserSync.init({
    port: 8010,
    server: {
      baseDir: 'src'
    }
  });

  gulp.watch('src/static/scss/*.scss', ['sass']);
  gulp.watch(['src/**']).on('change', reload);
});

gulp.task('default', ['dev']);
