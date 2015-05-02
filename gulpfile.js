var gulp = require('gulp');
var babel = require('gulp-babel');

gulp.task("default", ["babel", "watch"]);

gulp.task("watch", function () {
  gulp.watch("formsmith.js", ["babel"]);
});

gulp.task("babel", function () {
  gulp.src("formsmith.js")
    .pipe(babel())
    .pipe(gulp.dest("build"));
});