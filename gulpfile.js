/**
* To install a module as a development dependency (example of browserify):
* npm install --save-dev browserify
*/

//tasks variables ..............................................................
var gulp 		= require('gulp'),
	gutil 		= require('gulp-util'),
	//coffee 		= require('gulp-coffee'),
	concat 		= require('gulp-concat'),
	connect 	= require('gulp-connect'),
	compass 	= require('gulp-compass'),
	browserify 	= require('gulp-browserify'),
	uglify 		= require('gulp-uglify'),//minify all javascript
	minifyCss 	= require('gulp-minify-css'),//minify all css
	//decide if a pipe if executed
	gulpIf 		= require('gulp-if'),//conditionally control the flow of vinyl objects
	//imageMin 	= require('gulp-imagemin'),//minify all images (require pngcrush plugin)
	//pngCrusg 	= require('imagemin-pngcrush'),//required by 'gulp-imagemin'
	minifyHtml 	= require('gulp-minify-html');//minify all html
	//minifyJSON 	= require('gulp-jsonminify');//minify all json


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
					'components/scripts/rclick.js',
					'components/scripts/pixgrid.js',
					'components/scripts/tagline.js',
					'components/scripts/template.js'
				],
	'html' 		: [outputDir+'*.html'],
	//'json' 		: [outputDir+'js/*.json']
};


//destinations variable .........................................................
var destinations = { 
	'js' 		: outputDir+'js',
	'css'		: outputDir+'css'		 
};


//coffee task ...................................................................
// gulp.task('coffee', function(){   gutil.log('....... env='+env+' ..........');
// 	gulp.src(sources['coffee'])
// 		.pipe(coffee({ bare:true })
// 		.on('error', gutil.log))
// 		.pipe(gulp.dest('components/scripts')) 
// });


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
	//gulp.watch('builds/development/js/*.json', ['json']);
	//gulp.watch('builds/development/images/**/*.*', ['images']);
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


// //minify all images ...............................................................
// gulp.task('images', function(){
// 	gulp.src('builds/development/images/**/*.*')
// 		.pipe(gulpIf(env==='production', imageMin({
// 			progressive : true,
// 			svgPlugins 	: [{ removeViewBox : false }],
// 			use 		: [pngCrusg()]
// 		})))
// 		.pipe(gulpIf(env==='production', gulp.dest(outputDir + 'images')))
// 		.pipe(connect.reload());
// }); 


// //keep track of any activity on JSON files ........................................
// gulp.task('json', function(){
// 	gulp.src('builds/development/js/*.json')
// 		.pipe(gulpIf(env==='production', minifyJSON()))
// 		.pipe(gulpIf(env==='production', gulp.dest(outputDir)))
// 		.pipe(connect.reload());
// });

//default tasks ...................................................................
gulp.task('default', ['html', /*'json', 'coffee',*/ 'js', 'compass', /*'images',*/ 'connect', 'watch']);

