import {
    courtReserved
} from 'tennis-manager/helpers/court-reserved';
import {
    module,
    test
} from 'qunit';
import Ember from 'ember';

if (!Array.prototype.findIndex) {
    Object.defineProperty(Array.prototype, 'findIndex', {
        value: function(predicate) {
            'use strict';
            if (this == null) {
                throw new TypeError('Array.prototype.findIndex called on null or undefined');
            }
            if (typeof predicate !== 'function') {
                throw new TypeError('predicate must be a function');
            }
            var list = Object(this);
            var length = list.length >>> 0;
            var thisArg = arguments[1];
            var value;

            for (var i = 0; i < length; i++) {
                value = list[i];
                if (predicate.call(thisArg, value, i, list)) {
                    return i;
                }
            }
            return -1;
        },
        enumerable: false,
        configurable: false,
        writable: false
    });
}

module('Unit | Helper | court reserved');


function toObject(json) {
    return Ember.Object.extend(json).create();
}

test('does not find reservation at 4', function(assert) {
    //reservation from 4:00 to 5:00
    let result = courtReserved(null, toObject({
        reservationsInDay: Ember.A([toObject({
            id: '1',
            startTime: 1482202800000,
            endTime: 1482206400000
        })]),
        hour: 5
    }));
    assert.equal(result, '');
});

test('finds reservation at 5', function(assert) {
    // reservation from 5:00 to 6:00
    let result = courtReserved(null, toObject({
        reservationsInDay: Ember.A([toObject({
            id: '1',
            startTime: 1482206400000,
            endTime: 1482210000000
        })]),
        hour: 5
    }));
    assert.equal(result, 'full-reserved');
});

test('finds reservation at 5 - multi hour reservation', function(assert) {
    //reservation from 3:00 to 10:00
    let result = courtReserved(null, toObject({
        reservationsInDay: Ember.A([toObject({
            id: '1',
            startTime: 1482199200000,
            endTime: 1482224400000
        })]),
        hour: 5
    }));
    assert.equal(result, 'full-reserved', 'test 1');
    result = courtReserved(null, toObject({
        reservationsInDay: Ember.A([toObject({
            id: '1',
            startTime: 1482199200000,
            endTime: 1482224400000
        })]),
        hour: 6
    }));
    assert.equal(result, 'full-reserved', 'test 2');
    result = courtReserved(null, toObject({
        reservationsInDay: Ember.A([toObject({
            id: '1',
            startTime: 1482199200000,
            endTime: 1482224400000
        })]),
        hour: 9
    }));
    assert.equal(result, 'full-reserved', 'test 3');
    result = courtReserved(null, toObject({
        reservationsInDay: Ember.A([toObject({
            id: '1',
            startTime: 1482199200000,
            endTime: 1482224400000
        })]),
        hour: 10
    }));
    assert.equal(result, '');
    result = courtReserved(null, toObject({
        reservationsInDay: Ember.A([toObject({
            id: '1',
            startTime: 1482199200000,
            endTime: 1482224400000
        })]),
        hour: 11
    }));
    assert.equal(result, '', 'test 5');
});


test('finds half hour reservation - ends with half hour', function(assert) {
    //rservation from 5:00 to 6:30
    let result = courtReserved(null, toObject({
        reservationsInDay: Ember.A([toObject({
            id: '1',
            startTime: 1482206400000,
            endTime: 1482211800000
        })]),
        hour: 6
    }));
    assert.equal(result, 'half-end-reserved');
});


test('finds half hour reservation - starts with half hour', function(assert) {
    //rservation from 5:30 to 7:00
    let result = courtReserved(null, toObject({
        reservationsInDay: Ember.A([toObject({
            id: '1',
            startTime: 1482208200000,
            endTime: 1482211800000
        })]),
        hour: 5
    }));
    assert.equal(result, 'half-start-reserved');
});

test('finds two consequent reservations - end', function(assert) {
    //rservation from 5:30 to 7:00
    let result = courtReserved(null, toObject({
        reservationsInDay: Ember.A([
            toObject({
                id: '1',
                startTime: 1482208200000,
                endTime: 1482211800000
            }), //5:30 - 6:30
            toObject({
                id: '2',
                startTime: 1482211800000,
                endTime: 1482215400000
            }) //6:30-7:30
        ]),
        hour: 6
    }));
    assert.equal(result, 'full-reserved');
});
