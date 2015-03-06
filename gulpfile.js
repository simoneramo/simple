/**
 *
 *  gulpfile.js
 *
 *  1. Icons and Images combine
 *  3. Improve overall
 *  4. Add gulp-bower-files
 *  5. gulp-html2jade?
 *  6. if production or dev env
 *
 */

  // Dependencies
  var gulp               = require('gulp');
  var $                  = require('gulp-load-plugins')();
    //plugins used:

    // size              = require('gulp-size'),
    // jade              = require('gulp-jade'),
    // sass              = require('gulp-ruby-sass'),
    // uncss             = require('gulp-uncss'),
    // csso              = require('gulp-csso'),
    // gulpif            = require('gulp-if'),
    // changed           = require('gulp-changed')
    // autoprefixer      = require('gulp-autoprefixer'),
    // imagemin          = require('gulp-imagemin'),
    // newer             = require('gulp-newer');
    // uglify            = require('gulp-uglify'),
    // size              = require('gulp-size'),
    // notify            = require('gulp-notify'),
    // concat            = require('gulp-concat'),
    // coffee            = require('gulp-coffee'),
    // cssimport         = require("gulp-cssimport");
    // rename            = require('gulp-rename');

  var es                 = require('event-stream');
  var del                = require('del');
  var runSequence        = require('run-sequence');
  var browserSync        = require('browser-sync');
  var reload             = browserSync.reload;


  // scripts - http://goo.gl/UOpv25 > $ gulp scripts
  gulp.task('scripts', function() {
    var coffeeToJs = gulp.src('app/assets/scripts/**/*.coffee')          // Coffee Directory
    .pipe($.coffee());                                                   // Coffee
    var js = gulp.src('app/assets/scripts/**/*.js');                     // Js Directory
    return es.merge(coffeeToJs, js)                                      // Merge js + coffee with event-stream
    .pipe($.concat('scripts.min.js'))                                  // Concat
    .pipe($.uglify())                                                  // Uglify
    .pipe(gulp.dest('_public/assets/scripts'))                         // Dest Path
    //.pipe($.notify({ message: 'scripts done' }))                       // Notify
    .pipe($.size({title: 'scripts size'}));                            // Size
  });


  // styles Task > $ gulp styles
  gulp.task('styles', function () {
    return gulp.src(
    [ 'app/assets/scss/**/*.scss',
      '!app/assets/scss/variables.scss',                               // omit variable.scs from
      'Gemfile'
    ])                                                                 // css directory + Gemfile for globbing
    .pipe($.changed('scss', {extension: '.scss'}))                     // Check to see if changed
    .pipe($.rubySass({                                                 // Use gulp-rubySass
      bundleExec: true,
      require: 'sass-globbing',                                        // - true or false for bundle
      style: 'nested',                                                 // - nested, compact, compressed, expanded
      precision: 10                                                    // - default 3, to use when outputting decimal numbers.
      })
      .on('error', function(err){                                      // Output SASS Error
        console.log(err.message);
        this.end();
      })
    )
    // https://github.com/postcss/autoprefixer#browsers
    .pipe($.autoprefixer(                                               // Autoprefixer Browsers
      'last 2 version',                                                   // - last 2 version
      'safari 5',                                                         // - safari 5
      'ie 8',                                                             // - ie 8
      'ie 9',                                                             // - ie 9
      'opera 12.1',                                                       // - opera 12.1
      'ios 6',                                                            // - ios 6
      'android 4'                                                         // - android 4'
    ))
    .pipe(gulp.dest('.temp/css/'))                                       // Dev nested before ccso > delete
    .pipe($.if('**/*.css', $.csso()))
    //.pipe($.rename({suffix: '.min'}))                                 // Add gulp-csso to minify
    .pipe(gulp.dest('_public/assets/css'))                              // Destination Path
    //.pipe($.notify({ message: 'Styles completed fool' }))               // Notify
    .pipe($.size({title: 'styles size of'}));                           // Size
  });


  // uncss for removing used styles: $ gulp uncss
  gulp.task('uncss', ['html', 'styles'], function() {                    // Build HTML & Style files for uncss to run
    return gulp.src('_public/assets/css/*.css')                          // CSS Directory
    .pipe($.uncss({                                                    // Use gulp-uncss
      html: [
        '_public/index.html',                                          // List HTML files
        '_public/styleguide.html'
      ]
      // ,
      // ignore: [                                                     // CSS Selectors to ignore
      //   /.class-name/
      // ]
    }))
    .pipe($.csso())                                                    // Add gulp-sso to Minify
    .pipe(gulp.dest('_public/assets/css'))                             // Destination Path
    //.pipe($.notify({ message: 'uncss completed' }))                    // Notify
    .pipe($.size({title: 'styles uncss size of'}));                    // Size
  });


  // hack: if bower css covert to scss hack - fix later
  // https://github.com/sass/sass/issues/556#issuecomment-50825607
  gulp.task('cssToSass', ['styles'],function() {
    return gulp.src('components-bower/**/*.css')                         // Add Directory
    // .pipe($.cached('cssToSass'))                                    // Add Cached
    .pipe($.rename(function(path) {                                    // use Rename
      path.basename = '_' + path.basename;
      path.extname = '.scss';
    }))
    .pipe(gulp.dest('components-bower/converted-scss/'))               // Add gulp-sso to Minify
    //.pipe($.notify({ message: 'cssToSass' }))                          // Notify
    .pipe($.size({title: 'cssToSass size of'}));                       // Size
  });


  // jade > $ gulp jade
  gulp.task('jade', function() {
    return gulp.src(
      [
        'app/**/**/*.jade',                                                 // Jade Directory
        '!app/_partials/**/*.jade',
        // Exclude _partials directory from compiling in /app - app/_partials/**/*.html
      ])
    .pipe($.jade({                                                     // Use gulp-jade
      pretty: false                                                    // All Jade Options are available - http://jade-lang.com/api/
    }))
    .on('error', function(err){
      console.log(err.message);
      this.end();
    })
    .pipe(gulp.dest('_public'))
    // run and html min here to min html for .md files
    //.pipe($.notify({ message: 'HTML built' }))                         // Notify
    .pipe($.size({title: 'jade size of'}));                            // Size
  });


  // HTML > $ gulp html
  gulp.task('html', function() {
    return gulp.src(
      [
        'app/**/*.html',
        '!app/_partials/**/*.html',  // exclude partials
      ])

    .pipe($.htmlmin({collapseWhitespace: true}))
    .pipe(gulp.dest('_public'))
    //.pipe($.notify({ message: 'HTML built' }))                         // Notify
    .pipe($.size({title: 'HTML size of'}));                            // Size
  });


  // optimize images > $ gulp images
  gulp.task('images', function () {
    return gulp.src('app/assets/images/**/*')                            // Images Directory
    .pipe($.newer('_public/assets/images'))
    .pipe($.imagemin({                                         // Use gulp-imagemin
      optimizationLevel: 3,                                            // Default: 3: level between 0 and 7.
      progressive: true,                                               // Lossless conversion to progressive.
      interlaced: true,
        svgoPlugins: [{
          removeViewBox: false
        }]                                                            // Interlace gif for progressive rendering.
    }))
    .pipe(gulp.dest('_public/assets/images'))                          // Destination Path
    //.pipe($.notify({ message: 'Images built and optimized' }))         // Notify
    .pipe($.size({title: 'images size of'}));                          // Size
  });



  // fonts > $ gulp fonts
  gulp.task('fonts', function () {
    return gulp.src('app/assets/fonts/**/*')                           // Fonts Directory
    .pipe(gulp.dest('_public/assets/fonts'))                           // Destination Path
    //.pipe($.notify({ message: 'Fonts copied' }))                     // Notify
    .pipe($.size({title: 'fonts size of'}));                           // Size
  });



  // copy root files > $ gulp copy
  gulp.task('copy', function () {
    return gulp.src(
      [
        'app/*.{txt,md,htaccess,xml,ico}',
        'app/{CNAME,htaccess,LICENCE}'
      ],
      {
        dot: true
      }
    )
    .pipe(gulp.dest('_public'))                                        // Destination Path
    //.pipe($.notify({ message: 'root files copied' }))                    // Notify
    .pipe($.size({title: 'root files size of'}));                        // Size
  });


  // clean Output Directory > $ gulp serve
  gulp.task('clean', function(cb) {                                      // Clean
    del(['_public'] , cb)
  });


  // server via gulp-browserSync > $ gulp serve
  gulp.task('serve', ['default'], function() {
    browserSync({
      server: {
        baseDir: "_public"
      },
      port: 3001,
      // proxy: "localhost:9001",
      open: true,
      notify: true
    });
    gulp.watch(['app/assets/scss/**/*'], ['styles', reload]);
    gulp.watch(['app/assets/scripts/**/*.{js,coffee}'], ['scripts', reload]);
    gulp.watch(['app/**/*.{jade,md}'], ['jade', reload]);
    gulp.watch(['app/**/*.html'], ['html', reload]);
    gulp.watch(['app/assets/images/**/*'], reload);
    gulp.watch(['app/assets/icons/**/*'], reload);
    gulp.watch(['app/assets/fonts/**/*'], reload);
  });


  // just build assets using runSequence > $ gulp assets
  gulp.task('assets', function (cb) {
    runSequence(['styles', 'scripts', 'images', 'fonts'], cb);
  });


  // default: clean and build _public using runSequence > $ gulp default
  gulp.task('default', ['clean'], function (cb) {
    runSequence('styles', ['html', 'jade', 'scripts', 'images', 'fonts', 'copy'], cb);
  });


  // publish: build and publish to github branch:'' > $ gulp publish
  gulp.task('publish', function () {
    return gulp.src("_public/**/*")
    .pipe($.ghPages({
      branch: 'gh-pages'
    }))
  });
