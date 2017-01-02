import Ember from 'ember';

export function oldHour(params, hash) {
  let {
    hour,
    currentHour,
    day,
    currentDay
  } = hash;
  if (currentDay > day) {
    return true;
  }
  if (currentDay === day) {
    return currentHour > hour;
  }
  return false;
}

export default Ember.Helper.helper(oldHour);
