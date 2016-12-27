import Ember from 'ember';

export function toUnixTime(params/*, hash*/) {
  Ember.assert(`Helper capitalize-text must have an exact one parameter.`, params.length === 1);
  return params[0].getTime();
}

export default Ember.Helper.helper(toUnixTime);
