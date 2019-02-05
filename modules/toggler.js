class Toggler {
    constructor(props) {
        this.pin = props.pin;
        this.values = props.values || { on: 0, off: 1 };
        this.setState(props.state || 0);
    }

    turnOn() {
        this.setState(this.values.on);
    }

    turnOff() {
        this.setState(this.values.off);
    }

    setState(state) {
        this.state = !!parseInt(state);
        this.pin.write(this.state);
        this.emitChange(this.state ? this.values.on : this.values.off);
    }

    emitChange(value) {
        this.emit('change', value || this.state);
    }
}

exports.create = function create(props) {
    return new Toggler(props);
};
