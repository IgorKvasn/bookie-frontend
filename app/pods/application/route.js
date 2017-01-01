import Ember from 'ember';

export default Ember.Route.extend({
    moment: Ember.inject.service(),
    beforeModel() {
        this.get('moment').changeLocale('sk');
    },
    model(){
        return this.store.queryRecord('app-config', { app: 'ID_PROSET' }).then((config)=>{
            this.configService.set('config', config);
        }); //TODO identifikator kurtov - dotahovat napr. z environment.js, kde sa to bude injectiovat
        //TODO error handling cez ember-flash messages
    }
});
