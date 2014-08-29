(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){


// (It is the path element that animates.)
// We will separate the general progress element’s loading functionality from the
// rest.


function PathLoader( el ) {
    this.el = el;
    // clear stroke
    this.el.style.strokeDasharray = this.el.style.strokeDashoffset = this.el.getTotalLength();
}


PathLoader.prototype._draw = function( val ) {
    this.el.style.strokeDashoffset = this.el.getTotalLength() * ( 1 - val );
}


PathLoader.prototype.setProgress = function( val, callback ) {
    this._draw(val);
    if( callback && typeof callback === 'function' ) {
        // give it a time (ideally the same like the transition time) so that
        // the last progress increment animation is still visible.
        setTimeout( callback, 200 );
    }
}

//The setProgressFn method is used here to define a possible way to interact
//with the loader.
PathLoader.prototype.setProgressFn = function( fn ) {
    if( typeof fn === 'function' ) { fn( this ); }
}


//we are not preloading anything but instead we simulate a loading animation
//by setting a random value between 0 and 1 throughout a set of time
//intervals:
var simulationFn = function(instance) {
    var progress = 0,
        interval = setInterval( function() {
            progress = Math.min( progress + Math.random() * 0.1, 1 );
            instance.setProgress( progress );
            // reached the end
            if( progress === 1 ) {
                clearInterval( interval );
            }
        }, 100 );
};


var loader = new PathLoader([pathselector]);
loader.setProgressFn(simulationFn);
















},{}]},{},[1])