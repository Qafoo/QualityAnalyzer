/* eslint no-extend-native: 0, consistent-this: 0, prefer-reflect: 0 */

if (!Function.prototype.bind) {
    Function.prototype.bind = function (oThis) {
        if (typeof this !== "function") {
            // closest thing possible to the ECMAScript 5
            // internal IsCallable function
            throw new TypeError("Function.prototype.bind - what is trying to be bound is not callable")
        }

        var aArgs = Array.prototype.slice.call(arguments, 1)
        var toBind = this
        var NOP = function () {}
        var Bound = function () {
            return toBind.apply(
                this instanceof NOP && oThis ? this : oThis,
                aArgs.concat(Array.prototype.slice.call(arguments))
            )
        }

        if (this.prototype) {
            NOP.prototype = this.prototype
        }
        Bound.prototype = new NOP()

        return Bound
    }
}
