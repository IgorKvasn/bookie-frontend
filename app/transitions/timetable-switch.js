import {
    stop
} from "liquid-fire";

// arguments are passed directly from use statements in transition rules, e.g.
// this.use('myTransition', arg1, arg2)

export default function( /* arg1, arg2 */ ) {
    // Stop any currently running animation on oldElement
    stop(this.oldElement);

    let delegateTo = null;

    if (this.oldValue.getTime() < this.newValue.getTime()) {
        delegateTo = 'toLeft';
    } else {
        delegateTo = 'toRight';
    }

    return this.lookup('with-event').apply(this, [delegateTo]);
}
