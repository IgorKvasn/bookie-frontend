import {
    stop
} from "liquid-fire";

// arguments are passed directly from use statements in transition rules, e.g.
// this.use('myTransition', arg1, arg2)

export default function( /* arg1, arg2 */ ) {
    // Stop any currently running animation on oldElement
    stop(this.oldElement);

    let animation;
    if (this.oldValue.getTime() < this.newValue.getTime()) {
        animation = this.lookup('toLeft');
    } else {
        animation = this.lookup('toRight');
    }

    return animation.apply(this);
}
