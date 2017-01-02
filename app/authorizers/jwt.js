import Ember from 'ember';
import Base from 'ember-simple-auth/authorizers/base';

export default Base.extend({
  session: Ember.inject.service(),

  authorize(data, block) {
    if (Ember.testing) {
      block('Authorization', 'Bearer test-auth');
    }
    const {
      token
    } = data;
    if (this.get('session.isAuthenticated') && token) {
      block('Authorization', `Bearer ${token}`);
    }
  }
});
