
import { equalDates } from 'tennis-manager/helpers/equal-dates';
import { module, test } from 'qunit';
import moment from 'moment';

module('Unit | Helper | equal dates');

test('it works for equal dates', function(assert) {
  let date = new Date();
  let result = equalDates([date, date]);
  assert.ok(result);
});

test('it works for non-equal dates', function(assert) {
  let date1 = new Date();
  let date2 = moment().add(1, 'days').toDate();
  let result = equalDates([date1, date2]);
  assert.notOk(result);
});
