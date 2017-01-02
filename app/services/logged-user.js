import Ember from 'ember';

export default Ember.Service.extend({
    userData: null,

    username: Ember.computed.alias('userData.username'),
    phone: Ember.computed.alias('userData.phone'),
    email: Ember.computed.alias('userData.email'),

    setUser(userData) {
        this.set('userData', userData);
    },

    clearUser() {
        this.set('userData', null);
    }
});
