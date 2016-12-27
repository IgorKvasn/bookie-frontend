import DS from 'ember-data';

export default DS.Model.extend({
  courtName: DS.attr('string'),
  startTime: DS.attr('date'), //TODO overit, ci funguje v IE
  endTime: DS.attr('date'),
  reservedFor: DS.attr('string'),
  notifications: DS.attr('array-string')
});
