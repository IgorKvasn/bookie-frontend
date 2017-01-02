import Ember from 'ember';

export default Ember.Controller.extend({
    reservationsExpanded: false,
    flashMessages: Ember.inject.service(),
    session: Ember.inject.service('session'),
    loggedUser: Ember.inject.service('logged-user'),
    
    actions: {
        transitionTo(newRoute) {
            this.transitionToRoute(newRoute);
        },
        logout() {
            this.get('loggedUser').clearUser();
            this.get('session').invalidate();
        }
    }
});
