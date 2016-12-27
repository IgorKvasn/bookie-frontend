import Ember from 'ember';
import moment from 'moment';

export default Ember.Component.extend({
    classNames: ['layout-row', 'flex', 'court-timetable'],
    attributeBindings: ['data-court-name', 'data-day'],
    'data-court-name': Ember.computed.oneWay('courtName'),
    'data-day': Ember.computed.oneWay('day'),

    now: null,
    courtName: null,
    reservationsInDay: null,
    hoursPerDay: null,
    startOfDay: null,
    isLastCourtTimetable: null,
    onLastCourtTimetable: Ember.K,
    currentHour: null,
    currentDay: null,

    init(){
      this._super(...arguments);

      let now = new Date();
      this.set('currentHour', now.getHours());
      this.set('currentDay', moment(now).startOf('day').unix() * 1000);
    },


    initComponent: Ember.on('didInsertElement', function() {

        if (this.get('isLastCourtTimetable')) {
            Ember.run.schedule("afterRender", this, function() {
                this.get('onLastCourtTimetable')();
            });
        }
    }),

    hourIterator: Ember.computed('hoursPerDay', function() {
        let result = [];
        for (let i = 0; i < this.get('hoursPerDay'); i++) {
            result.push(i + this.get('startOfDay'));
        }
        return result;
    })


});
