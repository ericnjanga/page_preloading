//First we initialize and cache some variables:

// Include test capabilities for modernizr
require('browsernizr/test/css/animations');
require('browsernizr/lib/prefixed');

var Modernizr 	= require('browsernizr');
var classie 	= require('classie'); 
 

var support 	= { animations : Modernizr.cssanimations },
    container 	= document.getElementById( 'ip-container' ),
    header 		= container.querySelector( 'header.ip-header' ),
    loader 		= new PathLoader( document.getElementById( 'ip-loader-circle' ) ),
    animEndEventNames = { 
    	'WebkitAnimation' 	: 'webkitAnimationEnd', 
    	'OAnimation' 		: 'oAnimationEnd', 
    	'msAnimation' 		: 'MSAnimationEnd', 
    	'animation' 		: 'animationend' 
    },
    // animation end event name
    animEndEventName = animEndEventNames[ Modernizr.prefixed( 'animation' ) ];
 
			console.log( '*) container = ', container);







// We start the initial animation (both logo and loader slide up) by adding the
// loading class to the main container. After the animation ends we start the
// “fake” loading animation on the SVG loader element like explained before. Note
// that while these animations are taking place we don’t allow the page to be
// scrolled.
function init() {
    var onEndInitialAnimation = function() {

			console.log( '2) support.animations = ', support.animations);


			if( support.animations ) {  console.log( animEndEventName, ' ... ', onEndInitialAnimation );
            this.removeEventListener( animEndEventName, onEndInitialAnimation );
        }
 
        startLoading();
    };
 
    // [1] disable scrolling
    window.addEventListener( 'scroll', noscroll );
 
    // [2] initial animation
    classie.add( container, 'loading' );
 
    if( support.animations ) {

			console.log( '1) support.animations[', support.animations,'] animEndEventName[',animEndEventName,']');

        container.addEventListener( animEndEventName, onEndInitialAnimation );
    }
    else {
        onEndInitialAnimation();
    }
}




// Again, we will simulate that something is being loaded by passing a custom
// function to the setProgressFn. Once the animation is finished we replace the
// loading class with the loaded class which will initiate the main animations
// for the header and the content. After that’s done, we add the layout-switch
// class to the body and allow scrolling:
function startLoading() {
    // simulate loading something..
    var simulationFn = function(instance) {
        var progress = 0,
            interval = setInterval( function() {
                progress = Math.min( progress + Math.random() * 0.1, 1 );
 
                instance.setProgress( progress );
 
                // reached the end
                if( progress === 1 ) {
                    classie.remove( container, 'loading' );
                    classie.add( container, 'loaded' );
                    clearInterval( interval );
 
                    var onEndHeaderAnimation = function(ev) {
                        if( support.animations ) {
                            if( ev.target !== header ) return;
                            this.removeEventListener( animEndEventName, onEndHeaderAnimation );
                        }
 
                        classie.add( document.body, 'layout-switch' );
                        window.removeEventListener( 'scroll', noscroll );
                    };
 
                    if( support.animations ) {
                        header.addEventListener( animEndEventName, onEndHeaderAnimation );
                    }
                    else {
                        onEndHeaderAnimation();
                    }
                }
            }, 80 );
    };
 
    loader.setProgressFn( simulationFn );
}
 
// no scroll
function noscroll() {
    window.scrollTo( 0, 0 );
}

init();












