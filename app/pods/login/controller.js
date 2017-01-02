import Ember from 'ember';

export default Ember.Controller.extend({
    session: Ember.inject.service(),
    loggedUser: Ember.inject.service('logged-user'),
    loginInProgress: false,
    loginErrorMessage: null,

    actions: {
        forgotPassword() {

        },

        login() {
            this.set('loginInProgress', true);
            this.set('loginErrorMessage', null);
            var credentials = this.getProperties('identification', 'password'),
                authenticator = 'authenticator:jwt';
            this.get('session').authenticate(authenticator,
                    credentials)
                .then((data) => {
                  this.get('loggedUser').setUser(data);
                })
                .catch(() => {
                    this.set('loginErrorMessage', 'Nepodarilo sa prihlásiť.');
                }).finally(() => {
                    this.set('loginInProgress', false);
                });
        }
    }
});
