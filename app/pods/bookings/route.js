import Ember from 'ember';

export default Ember.Route.extend({
    actions: {
        willTransition: function() {
            Ember.$('body .half-cell').off('click.new-booking');
            Ember.$('body .court-timetable .court-cell').off('mouseenter.booking-info');
            Ember.$('body .court-timetable .court-cell').off('mouseleave.booking-info');
        }
    }
});
