import Ember from 'ember';
import Resolver from './resolver';
import loadInitializers from 'ember-load-initializers';
import config from './config/environment';

let App;

Ember.MODEL_FACTORY_INJECTIONS = true;

App = Ember.Application.extend({
  modulePrefix: config.modulePrefix,
  podModulePrefix: config.podModulePrefix,
  Resolver,
  ready: function(){
              /* jshint strict: false, -W117 */
              //for touch devices only - enable Fastclick
              if ('ontouchstart' in window) {
                      FastClick.attach(document.body);
              }

              // disable loading ...
              Ember.$('#loadingLogo').remove();//fadeOut(800, function() { $(this).remove(); });
      }

});

fixSecurity();
initPolyfills();
loadInitializers(App, config.modulePrefix);


function initPolyfills(){
  if (!Array.prototype.includes) {
  Array.prototype.includes = function(searchElement /*, fromIndex*/) {
    'use strict';
    if (this == null) {
      throw new TypeError('Array.prototype.includes called on null or undefined');
    }

    var O = Object(this);
    var len = parseInt(O.length, 10) || 0;
    if (len === 0) {
      return false;
    }
    var n = parseInt(arguments[1], 10) || 0;
    var k;
    if (n >= 0) {
      k = n;
    } else {
      k = len + n;
      if (k < 0) {k = 0;}
    }
    var currentElement;
    while (k < len) {
      currentElement = O[k];
      if (searchElement === currentElement ||
         (searchElement !== searchElement && currentElement !== currentElement)) { // NaN !== NaN
        return true;
      }
      k++;
    }
    return false;
  };
}
}

function fixSecurity() {
        /**
         * jQuery has a very bad habit of executing AJAX responses if they are of content-type application/javascript
         * this introduces a whole bunch of security problems... thanks jQuery
         */
        Ember.$.globalEval = function () {
        };
        Ember.$.ajaxSetup({
                converters: {
                        'text script': text => text
                }
        });
}


(function (){
	Ember.Route.reopen({
  activate: function() {
    var cssClass = this.toCssClass();
    // you probably don't need the application class
    // to be added to the body
    if (cssClass !== 'application') {
      Ember.$('body').addClass(cssClass);
    }
  },
  deactivate: function() {
    Ember.$('body').removeClass(this.toCssClass());
  },
  toCssClass: function() {
    return `tm-${this.routeName.replace(/\./g, '-').dasherize()}`;
  }
});
})();



export default App;
