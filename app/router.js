import Ember from 'ember';
import config from './config/environment';

const Router = Ember.Router.extend({
  location: config.locationType,
  rootURL: config.rootURL
});

Router.map(function() {
  this.route('bookings', {path: '/'}, function(){
    this.route('overview', {path: '/'});
    this.route('search');
  });
  this.route('account');
  this.route('login');
  this.route('register');
});

export default Router;
