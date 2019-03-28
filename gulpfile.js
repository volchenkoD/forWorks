const gulp = require('gulp');
const concat = require('gulp-concat');
const autoprefixer = require('gulp-autoprefixer');
const cleanCSS = require('gulp-clean-css');
const uglify = require('gulp-uglify');
const imagemin = require('gulp-imagemin');
const del = require('del');
const browserSync = require('browser-sync').create();
//Массив файлов стилей
const cssFiles = [
    './src/css/main.css',
    './src/css/media.css'
]
//Массив файлов скриптов
const jsFiles = [
    './src/js/lib.js',
    './src/js/main.js'
]
//Таск для обработки картинок
/*gulp.task('default', () =>
    gulp.src('src/images/*')
        .pipe(imagemin())
        .pipe(gulp.dest('build/images'))
)*/
//Таски для стилей CSS
function styles(){
    //Шаблон для поиска CSS файлов
    //Все файлы по шаблону './src/css/**/*.css/'
    return gulp.src(cssFiles)
    //объединение файлов в один
    .pipe(concat('style.css'))
    //автоматическое добавление префиксов
    .pipe(autoprefixer({
        browsers: ['>0.1%'],
        cascade: false
    }))
    //Минификация стилей
    .pipe(cleanCSS({
        level: 2
    }))
    // Выходная папка для стилей
    .pipe(gulp.dest('./build/css'))
    .pipe(browserSync.stream())
}

//Таски для JS скриптов
function scripts(){
     //Шаблон для поиска JS файлов
    //Все файлы по шаблону './src/js/**/*.js/'
    return gulp.src(jsFiles)
    //объединение файлов в один
    .pipe(concat('script.js'))
    //минификация скриптов
    .pipe(uglify({
        toplevel: true
    }))
    // Выходная папка для скриптов
    .pipe(gulp.dest('./build/js'))
    .pipe(browserSync.stream())
}
//удалить все в указанной папке
function clean(){
    return del(['build/*'])
}
//Просмотр файлов
function watch() {
    browserSync.init({
        server: {
            baseDir: "./"
        }
    });
    //следить за стилями
    gulp.watch('./src/css/**/*.css', styles)
    //следить за скриптами
    gulp.watch('./src/js/**/*.js', scripts)
    //следить за HTML файлами
    gulp.watch("./*.html").on('change', browserSync.reload)
}
//Таск вызывающий функцию styles
gulp.task('styles', styles);
//Таск вызывающий функцию scripts
gulp.task('scripts', scripts);
//Удаление временных файлов
gulp.task('del', clean);
//отслеживание изменений
gulp.task('watch', watch);
//удаление файлов в папке build и запуск стилей и скриптов
gulp.task('build', gulp.series(clean, gulp.parallel(styles, scripts)));
//
gulp.task('dev', gulp.series('build', 'watch'));
