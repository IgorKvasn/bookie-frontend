import Ember from 'ember';

export default Ember.Controller.extend({
reservationsExpanded: false,

  actions:{
    transitionTo(newRoute){
      this.transitionToRoute(newRoute);
    }
  }
});
