import Ember from 'ember';

export default Ember.Controller.extend({
  actions: {
    transitionTo(newRoute) {
      this.transitionToRoute(newRoute);
    }
  }
});
