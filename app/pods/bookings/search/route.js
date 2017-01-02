import Ember from 'ember';

export default Ember.Route.extend({
  setupController() {
    var controller = this.controllerFor('bookings.search');
    controller.initCalendarWidget();
  }
});
