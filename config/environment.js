/* jshint node: true */

module.exports = function(environment) {
  var ENV = {
    modulePrefix: 'tennis-manager',
    environment: environment,
    rootURL: '/',
    podModulePrefix: 'tennis-manager/pods',
    locationType: 'auto',
    EmberENV: {
      FEATURES: {
        // Here you can enable experimental features on an ember canary build
        // e.g. 'with-controller': true
      },
      EXTEND_PROTOTYPES: {
        // Prevent Ember Data from overriding Date.parse.
        Date: false
      }
    },

    APP: {
      // Here you can pass flags/options to your application instance
      // when it is created
    },

    moment: {
      // To cherry-pick specific locale support into your application.
      // Full list of locales: https://github.com/moment/moment/tree/2.10.3/locale
      includeLocales: ['sk'],
      allowEmpty: true
    }
  };

  ENV['ember-simple-auth'] = {
    authorizer: 'authorizer:jwt',
    routeAfterAuthentication: '/'
  };

  if (environment === 'development') {
    // ENV.APP.LOG_RESOLVER = true;
    // ENV.APP.LOG_ACTIVE_GENERATION = true;
    // ENV.APP.LOG_TRANSITIONS = true;
    // ENV.APP.LOG_TRANSITIONS_INTERNAL = true;
    // ENV.APP.LOG_VIEW_LOOKUPS = true;
    ENV.bookieConfig = {
      organization:{
        name: 'proset',
        email: 'stefan.ba@proset.sk',
        phone: '0904123456'
      },
      season:{
        name: 'Zima 2016/2017',
        dateStart: new Date(),
        timeStart: 7,
        timeEnd: 22
      },
      courtNames: ['K1', 'K2', 'K3', 'K4']
    };
  }

  if (environment === 'test') {
    // Testem prefers this...
    ENV.locationType = 'none';

    // keep test console output quieter
    ENV.APP.LOG_ACTIVE_GENERATION = false;
    ENV.APP.LOG_VIEW_LOOKUPS = false;

    ENV.APP.rootElement = '#ember-testing';
  }

  if (environment === 'production') {

  }

  return ENV;
};
