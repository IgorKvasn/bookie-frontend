import DS from 'ember-data';

export default DS.Model.extend({
  hoursPerDay: DS.attr('number'),
  courtNames: DS.attr('array-string'),
  startOfDay: DS.attr('number'),

});
