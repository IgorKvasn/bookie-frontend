import Ember from 'ember';
import config from '../../config/environment';

export default Ember.Service.extend({
    doNonAuthorizedGet(url, data, options) {

        let getJson = {
            url: `${config.rootURL}url`,
            method: 'GET',
            data
        };
        if (options) {
            getJson = Ember.merge(getJson, options);
        }

        return Ember.$.ajax(getJson);

    }
});
