//First we initialize and cache some variables:

var Modernizr = require('browsernizr');
var classie = require('classie');

var support = { animations : Modernizr.cssanimations },
    container = document.getElementById( 'ip-container' ),
    header = container.querySelector( 'header.ip-header' ),
    loader = new PathLoader( document.getElementById( 'ip-loader-circle' ) ),
    animEndEventNames = { 'WebkitAnimation' : 'webkitAnimationEnd', 'OAnimation' : 'oAnimationEnd', 'msAnimation' : 'MSAnimationEnd', 'animation' : 'animationend' },
    // animation end event name
    animEndEventName = animEndEventNames[ Modernizr.prefixed( 'animation' ) ];
