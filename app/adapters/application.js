import DS from 'ember-data';
import Ember from 'ember';

export default DS.RESTAdapter.extend({
    authorizer: 'authorizer:jwt',
    namespace: 'api',
    pathForType: function(type) {
        return Ember.String.singularize(type); //remove inflaction
    }
});
