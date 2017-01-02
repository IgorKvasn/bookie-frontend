import Ember from 'ember';

export default Ember.Component.extend({
  showTimepicker: false,

  _clickEventCallback: null,
  onChange: Ember.K,
  onChangeDummy: Ember.K,
  hours: 0,
  minutes: 0,
  required: false,
  errorMessages: null,

  initTimepicker: Ember.on('didInsertElement', function() {
    let now = new Date();
    this.set('hours', now.getHours());
    this.set('minutes', 0);

    let self = this;
    let clickEventCallback = function(event) {
      if (event.data && event.data.dontShowDialog === true) {
        return;
      }
      self.set('showTimepicker', true);
    };
    this.set('_clickEventCallback', clickEventCallback);

    Ember.$(this.element).find('input').on('focus', this.get('_clickEventCallback'));
  }),

  destroyComponent: Ember.on('willDestroyElement', function() {
    Ember.$(this.element).find('input').off('focus', this.get('_clickEventCallback'));
  }),

  formattedHours: Ember.computed('hours', function() {
    let hours = this.get('hours');
    if (hours < 9) {
      return `0${hours}`;
    }
    return hours;
  }),
  formattedMinutes: Ember.computed('minutes', function() {
    let minutes = this.get('minutes');
    if (minutes < 9) {
      return `0${minutes}`;
    }
    return minutes;
  }),

  actions: {
    cancelDialog() {
      this.set('showTimepicker', false);
      Ember.$(this.element).find('input').blur();
    },
    okDialog() {

      this.set('formattedValue', `${this.get('formattedHours')}:${this.get('formattedMinutes')}`);
      this.sendAction('onChange', this.get('hours') * 60 + this.get('minutes'));

      this.set('showTimepicker', false);
      Ember.$(this.element).find('input').blur();
    },

    addHours(delta) {
      let hours = this.get('hours');
      if (hours === 0 && delta < 0) {
        this.set('hours', 23);
        return;
      }

      if (hours === 23 && delta > 0) {
        this.set('hours', 0);
        return;
      }
      this.set('hours', hours + delta);
    },
    addMinutes(delta) {
      let minutes = this.get('minutes');
      if ((minutes + delta) < 0 && delta < 0) {
        this.set('minutes', 30);
        return;
      }

      if ((minutes + delta) >= 60 && delta > 0) {
        this.set('minutes', 0);
        return;
      }
      this.set('minutes', minutes + delta);
    }

  }

});
