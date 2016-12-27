
import { capitalizeText } from 'tennis-manager/helpers/capitalize-text';
import { module, test } from 'qunit';

module('Unit | Helper | capitalize text');

test('it capitalizes', function(assert) {
  let result = capitalizeText(['hello']);
  assert.equal(result, 'Hello');
});
