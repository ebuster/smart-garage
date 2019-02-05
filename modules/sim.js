// const sim = require('@amperka/Sim900r').connect();

class Sim {
    constructor(props) {
        this.powerPin = props.powerPin;
        this.statusPin = props.statusPin;
        this.init();
    }

    init() {
        pinMode(this.statusPin, 'input_pulldown');
        setWatch((e) => {
            if (e.state === true) {
                this.emit('powerOn');
            } else {
                this.emit('powerOff');
            }
        }, this.statusPin, {
            repeat: true,
            edge: 'both',
            debounce: 10
        });
    }

    powerOn() {
        digitalPulse(this.powerPin, 1, 1000);
    }

    powerOff() {
        digitalPulse(this.powerPin, 0, 1000);
    }

    isReady() {
        return !!digitalRead(this.statusPin);
    }
}

exports.connect = function(props) {
    // return require('@amperka/Sim900r').connect(props);
    return new Sim(props);
};