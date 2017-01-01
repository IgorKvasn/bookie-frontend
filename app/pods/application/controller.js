import Ember from 'ember';

export default Ember.Controller.extend({
reservationsExpanded: false,
flashMessages: Ember.inject.service(),

  actions:{
    transitionTo(newRoute){
      this.transitionToRoute(newRoute);
    }
  }
});
