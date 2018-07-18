const gulp = require("gulp");
const babel = require("gulp-babel");    // 用于ES6转化ES5
const uglify = require('gulp-uglify'); // 用于压缩 JS
const rename = require('gulp-rename'); // 重命名

const gulpif = require('gulp-if');
const gulpSequence = require('gulp-sequence');


// ES6转化为ES5
// 在命令行使用 gulp toes5 启动此任务
gulp.task("toes5", function () {
  return gulp.src("src/**/*.js")// ES6 源码存放的路径
    .pipe(babel({
        presets: ['env', 'stage-2']
    }))
    .pipe(gulp.dest("dist")); //转换成 ES5 存放的路径
});

// 压缩 js 文件
// 在命令行使用 gulp script 启动此任务
gulp.task('min', function() {
    // 1. 找到文件
    gulp.src(['./dist/*.js', '!dist/*.min.js'])
        // 2. 压缩文件
        .pipe(gulpif('!*.min.js',uglify()))
        .pipe(rename({suffix: '.min'}))
        // 3. 另存压缩后的文件
        .pipe(gulp.dest('dist'))
});

gulp.task('run', function (callback) {
    gulpSequence('toes5', 'min')(callback)
})

// 自动监控任务
// 在命令行使用 gulp auto 启动此任务
gulp.task('auto', function () {
    // 监听文件修改，当文件被修改则执行 script 任务
    gulp.watch(['src/**/*.js'], ['run']);
    // gulp.watch(['!dist/*.min.js'], 'dist/*.js', ['min']);

});