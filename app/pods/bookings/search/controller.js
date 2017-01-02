import Ember from 'ember';

const emailPattern = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

export default Ember.Controller.extend({
  calendarWidget: null,
  selectedDays: null,
  bookingDuration: 1,
  searchResult: null,
  searchPerformed: false,
  subscribeNotificationsEmail: null,
  simpleAjax: Ember.inject.service('simple-ajax'),

  emailValidation: [{
    message: 'Emailová adresa nemá správny formát.',
    validate: (inputValue) => {
      return emailPattern.test(inputValue);
    }
  }],

  initCalendarWidget() {
    let self = this;

    Ember.run.schedule("afterRender", this, function() {

      let calendar = new window.Flatpickr(Ember.$("#datepicker-search")[0], {
        inline: true,
        mode: 'multiple',
        "locale": "sk",
        onChange(newDate) {
          self.set('selectedDays', newDate);
        }
        // onDayCreate(a, b, c, d) {
        // console.log('day', a, b, c, d);
        // }
      });
      this.set('calendarWidget', calendar);
    });
  },

  canNotDecrementDuration: Ember.computed('bookingDuration', function() {
    return this.get('bookingDuration') <= 1;
  }),

  validationWorkaround() {
    Ember.$('md-input-container input').focus({
      dontShowDialog: true
    }); //TODO workaround for https://github.com/miguelcobain/ember-paper/issues/409
    Ember.$('md-input-container input').blur();
  },

  actions: {
    changeDuration(delta) {
      this.set('bookingDuration', this.get('bookingDuration') + delta);
    },

    searchBooking() {
      this.set('generalValidations', []);

      this.validationWorkaround();
      if (this.get('timeFrom') > this.get('timeUntil')) {
        this.get('generalValidations').push('Čas "do" nemôže byť menší ako čas "od".');
      }
      if (Ember.isEmpty(this.get('selectedDays'))) {
        this.get('generalValidations').push('Vyberte aspoň jeden deň.');
      }

      if (!Ember.isEmpty(this.get('generalValidations'))) {
        return;
      }
      if (Ember.isNone(this.get('timeFrom')) || Ember.isNone(this.get('timeUntil'))) {
        return;
      }

      //TODO required validation
      this.set('searchResult', null);
      this.set('searchPerformed', false);
      this.set('subscribeNotificationsEmail', null);

      let options = {
        duration: this.get('bookingDuration'),
        timeStart: this.get('timeFrom'),
        timeEnd: this.get('timeUntil'),
        days: this.get('selectedDays')

      };
      this.get('simpleAjax').doNonAuthorizedGet('/api/search-booking', options).then((result) => {
        this.set('searchResult', Ember.A(result));
        this.set('searchResultFound', !Ember.isEmpty(result));
        this.set('searchPerformed', true);
      }, (err) => {
        //TODO ajax error handling
        window.alert(JSON.stringify(err));
      });
    },

    showAvailableBooking(date) {
      window.alert('TODO', date); //TODO showAvailableBooking
    },

    subscribeNotifications() {
      window.alert('TODO'); //TODO subscribeNotifications - available in this.get('subscribeNotificationsEmail')
    }
  }
});
