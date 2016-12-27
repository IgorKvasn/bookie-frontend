import Ember from 'ember';

export function capitalizeText(params/*, hash*/) {
  Ember.assert(`Helper capitalize-text must have an exact one parameter.`, params.length === 1);
  return Ember.String.capitalize(params[0]);
}

export default Ember.Helper.helper(capitalizeText);
