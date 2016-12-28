import Ember from 'ember';

export default Ember.Route.extend({
    actions: {
        willTransition: function() {
          var controller = this.controllerFor('bookings');
          controller.destroyCellListeners();    
        }
    }
});
