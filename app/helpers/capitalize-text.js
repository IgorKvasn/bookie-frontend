import Ember from 'ember';

const capitalizeRegex = /(^|\/)([a-zA-Z\u00C0-\u024F])/g;

export function capitalizeText(params/*, hash*/) {
  Ember.assert(`Helper capitalize-text must have an exact one parameter.`, params.length === 1);
  return params[0].replace(capitalizeRegex, function (match) {return match.toUpperCase();});
  // return Ember.String.capitalize(params[0]);
}

export default Ember.Helper.helper(capitalizeText);
