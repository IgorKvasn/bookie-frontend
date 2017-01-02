import Ember from 'ember';

export default Ember.Component.extend({
  classNames: ['layout-row', 'flex', 'court-timetable-hours'],
  hoursPerDay: null,
  startOfDay: null,

  hourIterator: Ember.computed('hoursPerDay', function() {
    let result = [];
    for (let i = -1; i < this.get('hoursPerDay') - 1; i++) {
      let hour = i + this.get('startOfDay') + 1;
      if (hour < 9) {
        hour = '0' + hour;
      }
      result.push(`${hour}:00`);
    }
    return result;
  })
});
