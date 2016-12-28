import Ember from 'ember';
import DS from 'ember-data';

export default DS.Model.extend({
    reservations: DS.hasMany('reservation'),
    name: DS.attr('string'),
    tempDay: null,

    day: Ember.computed('reservations.[]', {
        get() {
            if (this.get('tempDay') === null) {
                let reservations = this.get('reservations');
                if (Ember.isEmpty(reservations)) {
                    return null;
                }
                this.set('tempDay', reservations.objectAt(0).get('startTime'));
            }
            return this.get('tempDay');
        },
        set(key, value) {
            this.set('tempDay', value);
            return value;
        }
    })
});
