import Ember from 'ember';
import ApplicationRouteMixin from 'ember-simple-auth/mixins/application-route-mixin';
import config from '../../config/environment';


export default Ember.Route.extend(ApplicationRouteMixin, {
  moment: Ember.inject.service(),
  beforeModel() {
    this.get('moment').changeLocale('sk');
  },
  model() {
    this.configService.set('config', config.bookieConfig);
  }
});
