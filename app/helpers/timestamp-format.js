import Ember from 'ember';
import moment from 'moment';

export function timestampFormat(params /*, hash*/ ) {
  Ember.assert(`Invalid use of timestamp-format helper - first param must be UNIX timestamp and second string format`, params.length === 2);
  return moment(parseInt(params[0], 10)).format(params[1]);
}

export default Ember.Helper.helper(timestampFormat);
