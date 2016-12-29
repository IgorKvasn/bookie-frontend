import Ember from 'ember';
import moment from 'moment';

export default Ember.Controller.extend({

    liquidFireEvents: Ember.inject.service(),

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
    timetableInitializedFirstTime: Date.now(),

    init() {
        this._super(...arguments);

        this.set('currentDay', moment().startOf('day').toDate());
    },

    initController: Ember.on('init', function() {
        this.set('selectedDay', moment().startOf('day').toDate());

        this.get('liquidFireEvents')
            .on('transitionBegan', () => {
                this.destroyCellListeners();
            }).on('transitionAnimated', () => {
                this.registerCellListeners();
            });

        let self = this;

        Ember.run.schedule("afterRender", this, function() {

          new window.Flatpickr(Ember.$("#datepicker")[0], {
                inline: true,
                onChange(newDate) {
                    self.set('selectedDay', newDate[0]);
                }
                // onDayCreate(a, b, c, d) {
                // console.log('day', a, b, c, d);
                // }
            });
        });
    }),

    showCellPopup: function(day, hour, half, courtName) {
        this.set('bookingDialogVisible', true);
        let bookingStart = moment(day).hours(hour);
        if (half === 2) {
            bookingStart.minutes(30);
        }

        let newReservation = this.store.createRecord('reservation', {
            id: `${Date.now()}`,
            startTime: bookingStart.toDate(),
            courtName
        });
        this.set('bookingDialogData', newReservation);
    },

    timetableObserver: Ember.observer('selectedDay', function() {
        Ember.run.once(this, 'timetableObserverFn');
    }),

    timetableObserverFn() {
        this.store.query('reservation', {
            day: this.get('selectedDay').getTime(),
        }).then((result) => {
            this.set('reservations', result);
            this.set('updatedDate', Date.now());
        });
        //TODO error handling

    },

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
                    $courtInfo.find('.note').text('Kliknite na rezervovanie');
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
            this.timetableObserverFn();
        },

        closeBookingDialog() {
            this.set('bookingDialogVisible', false);
        },

        onBookingCreated(newBooking) {
            let newBookingDay = moment(newBooking.get('startTime')).startOf('day').unix() * 1000;
            let court = this.store.peekAll('court').find((court) => {
                return court.get('day').getTime() === newBookingDay;
            });
            if (Ember.isPresent(court)) {
                court.get('reservations').pushObject(newBooking);
            }
        },
        onLastCourtTimetable() {
            this.registerCellListeners();
        },


        jumpToToday() {
            this.set('selectedDay', moment(this.get('currentDay')).subtract(1, 'day').toDate());
        },

        showPreviousDay() {
            this.set('selectedDay', moment(this.get('selectedDay')).subtract(1, 'day').toDate());
        },

        showNextDay() {
            this.set('selectedDay', moment(this.get('selectedDay')).add(1, 'day').toDate());
        }
    }
});
