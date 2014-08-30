/**
* To install a module as a development dependency (example of browserify):
* npm install --save-dev browserify
--------------
* To install a module from GIT:
* npm install --save-dev git://github.com/****.git
*/ 

//tasks variables ..............................................................
var gulp 		= require('gulp'),
	gutil 		= require('gulp-util'), 
	concat 		= require('gulp-concat'),
	connect 	= require('gulp-connect'),
	compass 	= require('gulp-compass'),
	browserify 	= require('gulp-browserify'), 
	uglify 		= require('gulp-uglify'),//minify all javascript
	minifyCss 	= require('gulp-minify-css'),//minify all css
	//decide if a pipe if executed
	gulpIf 		= require('gulp-if'),//conditionally control the flow of vinyl objects 
	minifyHtml 	= require('gulp-minify-html');//minify all html 


//..............................................................................
var env,
	sources,
	outputDir;


//environment variable ..........................................................
/**
 * command for executing gulp in production environment:
 * NODE_ENV=production gulp
*/
env = process.env.NODE_ENV || 'development';


//processed files destination depends on the environment ........................
if(env==='development'){
	outputDir = 'builds/development/'; 
}else{
	outputDir = 'builds/production/'; 
}


//sources variable ..............................................................
sources = {
	//'coffee' 	: ['components/coffee/tagline.coffee'],
	'sass' 		: ['components/sass/style.scss'],
	'js' 		: [
					'components/scripts/strict-mode.js',
					'components/scripts/pathloader.js',
					'components/scripts/main.js' 
				],
	'html' 		: [outputDir+'*.html'], 
};


//destinations variable .........................................................
var destinations = { 
	'js' 		: outputDir+'js',
	'css'		: outputDir+'css'		 
};
 


//javascript task ...............................................................
gulp.task('js', function(){
	gulp.src(sources['js'])
		.pipe(concat('script.js'))
		.pipe(browserify())
		.pipe(gulpIf(env==='production', uglify()))
		.pipe(gulp.dest(destinations['js']))
		.pipe(connect.reload()) //keeps track of any javascript activities
});


//compass task ..................................................................
gulp.task('compass', function(){ 
	gulp.src(sources['sass'])
		.pipe(compass({
			sass 	: 'components/sass',
			image 	: outputDir+'images'
		})
		.on('error', gutil.log))  
		//'If we are on a production environment'> 
		//minify streamed css before it is sent to the destination folder
		.pipe( gulpIf((env==='production'), minifyCss()) )
		.pipe(gulp.dest(destinations['css']))
		.pipe(connect.reload()) //keeps track of any compass activities
});
   

//watch some activities and trigger some tasks in response ........................
gulp.task('watch', function(){
	//gulp.watch(sources['coffee'], ['coffee']);
	gulp.watch(sources['js'], ['js']);
	gulp.watch('components/sass/*.scss', ['compass']);
	gulp.watch('builds/development/*.html', ['html']); 
});


//connect to server and live reload task ..........................................
gulp.task('connect', function(){
	connect.server({
		root : outputDir,
		livereload : true
	});
});


//keep track of any activity on HTML files ........................................
gulp.task('html', function(){
	gulp.src('builds/development/*.html')
		.pipe(gulpIf(env==='production', minifyHtml()))
		.pipe(gulpIf(env==='production', gulp.dest(outputDir)))
		.pipe(connect.reload());
});


 

//default tasks ...................................................................
gulp.task('default', ['html', 'js', 'compass', 'connect', 'watch']);

