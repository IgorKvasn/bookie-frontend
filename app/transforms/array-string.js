import Ember from 'ember';
import DS from 'ember-data';

// Converts centigrade in the JSON to fahrenheit in the app
export default DS.Transform.extend({
    deserialize: function(serialized) {
        return (Ember.typeOf(serialized) === 'array') ? serialized : [];
    },
    serialize: function(deserialized) {
        var type = Ember.typeOf(deserialized);
        if (type === 'array') {
            return deserialized;
        } else if (type === 'string') {
            return deserialized.split(',').map(function(item) {
                return item.toString().trim();
            });
        } else {
            return [];
        }
    }
});
