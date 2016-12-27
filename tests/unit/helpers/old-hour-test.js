import {
    oldHour
} from 'tennis-manager/helpers/old-hour';
import {
    module,
    test
} from 'qunit';

module('Unit | Helper | old hour');

[{
    testName: 'works for old day',
    hour: 10,
    currentHour: 20,
    day: 1,
    currentDay: 4,
    expectedResult: true
}, {
    testName: 'works for new day',
    hour: 10,
    currentHour: 20,
    day: 5,
    currentDay: 4,
    expectedResult: false
}, {
    testName: 'works for same day, old hour',
    hour: 10,
    currentHour: 20,
    day: 5,
    currentDay: 5,
    expectedResult: true
}, {
    testName: 'works for same day, new hour',
    hour: 21,
    currentHour: 20,
    day: 5,
    currentDay: 5,
    expectedResult: false
}, {
    testName: 'works for same day, same hour',
    hour: 21,
    currentHour: 21,
    day: 5,
    currentDay: 5,
    expectedResult: false
}].forEach((testConfig) => {
    test(testConfig.testName, function(assert) {
        let result = oldHour(null, testConfig);
        assert.equal(result, testConfig.expectedResult);
    });
});
