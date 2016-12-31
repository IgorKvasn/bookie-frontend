import Ember from 'ember';

export default Ember.Route.extend({
    setupController() {
        var controller = this.controllerFor('bookings.overview');
        controller.initCalendarWidget();
        Ember.run.schedule("afterRender", this, function() {
            controller.registerCellListeners();
        });
    },
    actions: {
        willTransition: function() {
            var controller = this.controllerFor('bookings.overview');
            controller.destroyCellListeners();
        }
    }
});
