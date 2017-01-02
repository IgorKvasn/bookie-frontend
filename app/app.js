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
  ready: function() {
    /* jshint strict: false, -W117 */
    //for touch devices only - enable Fastclick
    if ('ontouchstart' in window) {
      FastClick.attach(document.body);
    }

    // disable loading ...
    Ember.$('#loadingLogo').remove(); //fadeOut(800, function() { $(this).remove(); });
  }

});

fixSecurity();
initPolyfills();
loadInitializers(App, config.modulePrefix);


window.Flatpickr.l10ns.sk = {
  firstDayOfWeek: 1,
  weekdays: {
    shorthand: ['Ne', 'Po', 'Ut', 'St', 'Št', 'Pi', 'So'],
    longhand: ['Nedeľa', 'Pondelok', 'Utorok', 'Streda', 'Štvrtok', 'Piatok', 'Sobota']
  },
  months: {
    shorthand: ['Jan', 'Feb', 'Mar', 'Apr', 'Máj', 'Jún', 'Júl', 'Aug', 'Sep', 'Okt', 'Nov', 'Dec'],
    longhand: ['Január', 'Február', 'Marec', 'Apríl', 'Máj', 'Jún', 'Júl', 'August', 'September', 'Október', 'November', 'December']
  }
};

function initPolyfills() {
  if (!Array.prototype.includes) {
    Array.prototype.includes = function(searchElement /*, fromIndex*/ ) {
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
        if (k < 0) {
          k = 0;
        }
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

  if (!Array.prototype.findIndex) {
    Object.defineProperty(Array.prototype, 'findIndex', {
      value: function(predicate) {
        'use strict';
        if (this == null) {
          throw new TypeError('Array.prototype.findIndex called on null or undefined');
        }
        if (typeof predicate !== 'function') {
          throw new TypeError('predicate must be a function');
        }
        var list = Object(this);
        var length = list.length >>> 0;
        var thisArg = arguments[1];
        var value;

        for (var i = 0; i < length; i++) {
          value = list[i];
          if (predicate.call(thisArg, value, i, list)) {
            return i;
          }
        }
        return -1;
      },
      enumerable: false,
      configurable: false,
      writable: false
    });
  }
}

function fixSecurity() {
  /**
   * jQuery has a very bad habit of executing AJAX responses if they are of content-type application/javascript
   * this introduces a whole bunch of security problems... thanks jQuery
   */
  Ember.$.globalEval = function() {};
  Ember.$.ajaxSetup({
    converters: {
      'text script': text => text
    }
  });
}


(function() {
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
