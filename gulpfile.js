var gulp        = require('gulp');
var sass        = require('gulp-sass');
var browserSync = require('browser-sync');
var reload      = browserSync.reload;

gulp.task('sass',function(){
  return gulp.src('src/static/scss/*.scss')
    .pipe(sass())
    .pipe(gulp.dest('src/static/css'))
    .pipe(reload({stream: true}));
});

gulp.task('dev', ['sass'], function(){
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
