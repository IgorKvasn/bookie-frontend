import Ember from 'ember';

export function equalDates(params /*, hash*/ ) {
  return params[0].getTime() === params[1].getTime();
}

export default Ember.Helper.helper(equalDates);
