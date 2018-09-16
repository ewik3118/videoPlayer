var gulp                = require('gulp'),
    sass                = require('gulp-sass'),
    autoprefixer_sass   = require('gulp-autoprefixer'),
    ts                  = require("gulp-typescript"),
    tsProject = ts.createProject("tsconfig.json");

gulp.task('sass', function () {
    return gulp.src('assets/css/style.scss')
        .pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
        .pipe(autoprefixer_sass())
        .pipe(gulp.dest('assets/dist/css'));
});

gulp.task("script", function () {
    return tsProject.src()
        .pipe(tsProject())
        .js.pipe(gulp.dest('assets/dist/js'));
});

gulp.task('default', ['sass', 'script']);

