import Ember from 'ember';
import moment from 'moment';

export default Ember.Controller.extend({

  session: Ember.inject.service('session'),
  liquidFireEvents: Ember.inject.service(),
  flashMessages: Ember.inject.service(),
  simpleAjax: Ember.inject.service(),

  reservations: null,

  bookingDialogVisible: false,
  bookingDialogData: null,

  startOfDay: Ember.computed.alias('configService.config.startOfDay'),
  hoursPerDay: Ember.computed.alias('configService.config.hoursPerDay'),
  courtNamesArray: Ember.computed('configService.config.courtNames', function() {
    return new Ember.A(this.get('configService.config.courtNames'));
  }),
  currentStartOfWeek: null,
  currentDay: null,
  updatedDate: null,
  timetableInitializedFirstTime: false,
  calendarWidget: null,
  loadingTimetable: false,

  init() {
    this._super(...arguments);

    this.set('currentDay', moment().startOf('day').toDate());
  },

  initController: Ember.on('init', function() {
    let newDay = moment().startOf('day').toDate();
    this.fetchTimetable(newDay);

    this.get('liquidFireEvents')
      .on('transitionBegan', () => {
        this.destroyCellListeners();
      }).on('transitionAnimated', () => {
        this.registerCellListeners();
      });
  }),

  initCalendarWidget() {
    let self = this;

    Ember.run.schedule("afterRender", this, function() {
      const $element = Ember.$("#datepicker")[0];
      if (Ember.isNone($element)) {
        //page is not fully initialized, yet
        return;
      }
      let calendar = new window.Flatpickr($element, {
        inline: true,
        "locale": "sk",
        onChange(newDate) {
          self.fetchTimetable(newDate[0]);
        }
        // onDayCreate(a, b, c, d) {
        // console.log('day', a, b, c, d);
        // }
      });
      this.set('calendarWidget', calendar);
      this.get('calendarWidget').setDate(this.get('selectedDay'));
    });
  },

  showCellPopup: function(day, hour, half, courtName) {
    this.set('bookingDialogVisible', true);
    let bookingStart = moment(day).hours(hour);
    if (half === 2) {
      bookingStart.minutes(30);
    }

    let newReservation = {
      startTime: bookingStart.toDate(),
      courtName
    };
    this.set('bookingDialogData', newReservation);
  },

  fetchTimetable(newDayArg) {
    const newDay = newDayArg || this.get('selectedDay');
    const flashMessages = this.get('flashMessages');

    let $overlay = Ember.$('.loading-overlay');
    let $bookingRow = Ember.$('.booking-row');
    if ($bookingRow.length !== 0) {
      let {
        top,
        left
      } = $bookingRow[0].getBoundingClientRect();
      $overlay.css({
        top,
        left,
        width: $bookingRow.width(),
        height: $bookingRow.height()
      });
      $overlay.show();
    }
    this.set('loadingTimetable', true);
    this.get('simpleAjax').get('/booking', {
      day: newDay.getTime(),
    }).then((result) => {
      this.initCalendarWidget();
      this.set('reservations', result);
      this.set('updatedDate', Date.now());
      this.set('selectedDay', newDay);
    }).catch(() => {
      flashMessages.danger('Nepodarilo sa získať rozpis termínov.', {
        sticky: true
      });
    }).finally(() => {
      this.set('loadingTimetable', false);
      $overlay.hide();
    });

  },

  noTimetableData: Ember.computed('reservations', function() {
    return this.get('reservations') === null;
  }),

  findAvailableHalfCell($courtCell) {
    let $parent = $courtCell.parents('.court-cell');
    let courtCellClasses = $parent.attr('class').split(' ');
    if (courtCellClasses.includes('half-start-reserved')) {
      return 1;
    }
    if (courtCellClasses.includes('half-end-reserved')) {
      return 2;
    }
    if (courtCellClasses.includes('full-reserved')) {
      //no available cell half
      return null;
    }
    //the whole cell is available
    return 1;
  },

  destroyCellListeners() {
    Ember.$('body .half-cell').off('click.new-booking');
    Ember.$('body .court-timetable .court-cell').off('mouseenter.booking-info');
    Ember.$('body .court-timetable .court-cell').off('mouseleave.booking-info');
  },

  registerCellListeners() {
    let self = this;
    if (this.get('session.isAuthenticated')) {
      Ember.$('body .court-cell:not(.full-reserved, .old-hour) .half-cell').on('click.new-booking', function() {
        let $this = Ember.$(this);
        let $courtTimetable = $this.parents('.court-timetable');
        let availableHalf = self.findAvailableHalfCell($this);
        if (Ember.isNone(availableHalf)) {
          //uz sa neda kam kliknut
          return;
        }
        self.showCellPopup($courtTimetable.data('day'), $this.parents('.court-cell').data('hour'), availableHalf, $courtTimetable.data('courtName'));
      });
    }

    Ember.$('body .court-timetable .court-cell').on('mouseenter.booking-info', function() {
      let $courtInfo = Ember.$('.court-info-popup');
      let {
        top,
        left
      } = Ember.$(this).offset();

      let cellTop = parseInt(top, 10);
      let cellLeft = parseInt(left, 10);
      let $this = Ember.$(this);

      $courtInfo.css({
        top: `${cellTop + $this.height() + 5}px`,
        left: `${cellLeft - ($courtInfo.width() - $this.width())/2}px`
      });

      let parentData = $this.parent('.court-timetable').data();
      let hourStart = $this.data().hour;
      let hourEnd = hourStart + 1;
      if (hourStart < 9) {
        hourStart = '0' + hourStart;
      }
      if (hourEnd < 9) {
        hourEnd = '0' + hourEnd;
      }
      $courtInfo.find('.hour').text(`${hourStart}:00 - ${hourEnd}:00`);
      $courtInfo.find('.court').text(parentData.courtName);

      let classes = $this.attr('class').split(' ');
      if (classes.includes('full-reserved')) {
        $courtInfo.find('.state').text('Obsadené');
        $courtInfo.find('.note').text('');
      } else {
        $courtInfo.find('.state').text('Voľné');
        if (classes.includes('old-hour')) {
          $courtInfo.find('.note').text('');
        } else {
          if (self.get('session.isAuthenticated')) {
            $courtInfo.find('.note').text('Kliknite na rezervovanie');
          } else {
            $courtInfo.find('.note').text('Na rezervovanie sa musíte prihlásiť.');
          }
        }
      }

      $courtInfo.addClass('visible');
    });
    Ember.$('body .court-timetable .court-cell').on('mouseleave.booking-info', function() {
      let $courtInfo = Ember.$('.court-info-popup');
      $courtInfo.removeClass('visible');
    });

  },


  actions: {

    updateTimetable() {
      this.fetchTimetable();
    },

    closeBookingDialog() {
      this.set('bookingDialogVisible', false);
    },

    onBookingCreated() {
      return this.fetchTimetable();
    },
    onLastCourtTimetable() {
      this.registerCellListeners();
    },


    jumpToToday() {
      let newDate = moment(this.get('currentDay')).subtract(1, 'day').toDate();
      this.fetchTimetable(newDate);
    },

    showPreviousDay() {
      let newDate = moment(this.get('selectedDay')).subtract(1, 'day').toDate();
      this.fetchTimetable(newDate);
    },

    showNextDay() {
      let newDate = moment(this.get('selectedDay')).add(1, 'day').toDate();
      this.fetchTimetable(newDate);
    }
  }
});
