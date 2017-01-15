import Ember from 'ember';
import config from '../config/environment';

export default Ember.Service.extend({

  _doRequest(method, url, data, options) {
    let getJson = {
      url: `${config.rootURL}api${url}`,
      method,
      data
    };
    if (options) {
      getJson = Ember.merge(getJson, options);
    }

    let promise = new Ember.RSVP.Promise((resolve, reject) => {
      Ember.$.ajax(getJson).done((data) => {
          resolve(this._processResponse(data));
        })
        .fail((err) => reject(err));
    });

    return promise;
  },

  _processResponse(data) {
    if (Array.isArray(data)) {
      return createArray(data);
    }
    return createObject(data);

    function createArray(data) {
      let arr = data.map((el) => createObject(el));
      return Ember.A(arr);
    }

    function createObject(data) {
      return Ember.Object.extend({}).create(data);
    }
  },


  get(url, data, options) {
    return this._doRequest('GET', url, data, options);
  },

  post(url, data, options) {
    return this._doRequest('POST', url, data, options);
  }
});
