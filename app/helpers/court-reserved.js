import Ember from 'ember';
import moment from 'moment';

export function courtReserved(params, hash) {
  let {
    reservationsInDay,
    hour,
    courtName
  } = hash;


  let reserved = reservationsInDay.find((res) => {
    if (res.get('courtName') !== courtName) {
      return false;
    }
    let reservationStartHour = moment(res.get('startTime')).get('hour');
    let reservationEndHour = moment(res.get('endTime')).get('hour');
    let reservationEndMinutes = moment(res.get('endTime')).get('minutes');

    if (reservationStartHour <= hour) {
      if (reservationEndHour > hour) {
        //ends at this hour
        return true;
      }
      if (reservationEndHour === hour && reservationEndMinutes > 0) {
        //half hour end
        return true;
      }
    }
    return false;
  });

  if (!reserved) {
    return '';
  }

  let reservationStartHour = moment(reserved.get('startTime')).get('hour');
  let reservationStartMinutes = moment(reserved.get('startTime')).get('minutes');

  let reservationEndHour = moment(reserved.get('endTime')).get('hour');
  let reservationEndMinutes = moment(reserved.get('endTime')).get('minutes');


  if (reservationStartHour === hour && reservationStartMinutes > 0) {
    return 'half-start-reserved';
  }

  if (reservationEndHour === hour && reservationEndMinutes > 0) {

    //check if there is no next reservation right after this one
    let thisReservationIndex = reservationsInDay.toArray().findIndex((res) => res.get('id') === reserved.get('id'));
    let nextReservation = reservationsInDay.objectAt(thisReservationIndex + 1);
    if (Ember.isPresent(nextReservation)) {
      let nextReservationStartHour = moment(nextReservation.get('startTime')).get('hour');
      if (nextReservationStartHour === reservationEndHour) {
        return 'full-reserved';
      }
    }

    return 'half-end-reserved';
  }

  return 'full-reserved';
}

export default Ember.Helper.helper(courtReserved);
