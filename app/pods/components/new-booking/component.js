import Ember from 'ember';
import moment from 'moment';

const emailPattern = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

function validateNotificationFormat(inputValue) {
  if (Ember.isEmpty(inputValue)) {
    return true;
  }

  let emailList = inputValue.split(',').filter((address) => {
    return Ember.isPresent(address) && address.trim().length > 0;
  });
  return _.every(emailList, ((email) => {
    return emailPattern.test(email.trim());
  }));
}

export default Ember.Component.extend({
  newReservation: null,
  onBookingClose: Ember.K,
  onBookingCreated: Ember.K,
  bookingDuration: 1,

  flashMessages: Ember.inject.service(),
  simpleAjax: Ember.inject.service(),

  emailValidation: [{
    message: 'Jedna alebo viacero emailových adries nemá správny formát.',
    validate: (inputValue) => {
      return validateNotificationFormat(inputValue);
    }
  }],

  canNotDecrementDuration: Ember.computed('bookingDuration', function() {
    return this.get('bookingDuration') <= 1;
  }),

  extractNotificationEmails() {
    let notifInput = this.get('newReservation.notifications');
    if (Ember.isEmpty(notifInput)) {
      return [];
    }

    return _.chain(notifInput.split(','))
      .filter((address) => {
        return Ember.isPresent(address) && address.trim().length > 0;
      })
      .map((address) => address.trim()).value();
  },

  phoneInputValidationWorkaround() {
    Ember.$('.phoneInput input').focus(); //TODO workaround for https://github.com/miguelcobain/ember-paper/issues/409
    Ember.$('.phoneInput input').blur();
  },

  actions: {

    changeDuration(delta) {
      this.set('bookingDuration', this.get('bookingDuration') + delta);
    },

    changeTime(date, delta) {
      this.set(date, moment(this.get(date)).add(delta, 'minutes').toDate());
    },

    cancelBookingDialog() {
      this.get('onBookingClose')();
    },
    confirmBookingDialog() {
      const flashMessages = this.get('flashMessages');
      flashMessages.clearMessages();
      this.phoneInputValidationWorkaround();

      if (!validateNotificationFormat(this.get('newReservation.notifications'))) {
        return;
      }
      if (Ember.isEmpty(this.get('newReservation.phone'))) {
        return;
      }

      this.get('newReservation').setProperties({
        notifications: this.extractNotificationEmails(),
        endTime: moment(this.get('newReservation.startTime')).add(this.get('bookingDuration'), 'hours').toDate()
      });
      let $dialog = Ember.$('.new-booking-dialog');
      let $loading = $dialog.find('.loading-overlay');
      $loading.css({
        width: $dialog.width(),
        height: $dialog.height()
      });
      $loading.show();

      this.get('simpleAjax').post('/booking', this.get('newReservation')).then((result) => {
        flashMessages.success('Rezervácia úspešná.', {
          timeout: 5000,
          sticky: false
        });

        this.get('onBookingCreated')(result).then(() => {
          this.get('onBookingClose')();
        });

      }).catch(( /*error*/ ) => {
        flashMessages.danger('Chyba počas vytvorenia rezervácie.', {
          sticky: true
        });
        this.get('onBookingClose')();
      }).finally(() => {
        $loading.hide();
      });

    }
  }
});
