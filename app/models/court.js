import DS from 'ember-data';

export default DS.Model.extend({
  day: DS.attr('date'),
  reservations: DS.hasMany('reservation'),
  name: DS.attr('string')
});
