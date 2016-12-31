import Ember from 'ember';

export default Ember.Service.extend({
    doNonAuthorizedGet(url, data, options) {

        let getJson = {
            url,
            method: 'GET',
            data
        };
        if (options) {
            getJson = Ember.merge(getJson, options);
        }

        return Ember.$.ajax(getJson);

    }
});
