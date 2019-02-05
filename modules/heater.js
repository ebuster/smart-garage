class Heater {
    constructor(pins) {
        this.lowPin = pins.lowPin;
        this.highPin = pins.highPin;

        this.power = {
            high: 0,
            low: 0
        };
    }

    switchHigh(state, noEmit) {
        this.highPin.write(state);
        this.power.high = state ? 1250 : 0;

        noEmit || this.emitChange();

        return this;
    }

    switchLow(state, noEmit) {
        this.lowPin.write(state);
        this.power.low = state ? 750 : 0;

        noEmit || this.emitChange();
    }

    emitChange() {
        this.emit('change', this.getPower());
    }

    getPower() {
        return this.power.low + this.power.high;
    };

    turnOnHigh() {
        this.switchHigh(1);
    }

    turnOnLow() {
        this.switchLow(1);
    }

    turnOffHigh() {
        this.switchHigh(0);
    }

    turnOffLow() {
        this.switchLow(0);
    }

    turnOn() {
        this.switchLow(1, true);
        this.switchHigh(1, true);

        this.emitChange();
    }

    turnOff() {
        this.switchLow(0, true);
        this.switchHigh(0, true);

        this.emitChange();
    }

    isLowPower() {
        //return (peek32(0x50000504) >> 4) & 1; // pin4
        return this.getPower() === 750;
    }

    isHighPower() {
        //return (peek32(0x50000504) >> 5) & 1; // pin5
        return this.getPower() === 1250;
    }

    isFullPower() {
        return this.getPower() === 2000;
    }

    setPower(power) {
        switch (power) {
            case '0':
                this.turnOff();
                break;
            case '2000':
                this.turnOn();
                break;
            case '1250':
                this.turnOffLow();
                this.turnOnHigh();
                break;
            case '750':
                this.turnOffHigh();
                this.turnOnLow();
                break;
            default:
                if (power < this.getPower() && power < 750) {
                    this.turnOff();
                }
                // console.log('Unsupported power value', power);
        }
    }

}

exports.create = function create(props) {
    return new Heater(props);
};