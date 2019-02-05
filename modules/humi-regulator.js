class HumiRegulator
{
    constructor(props) {
        this.cooler = props.cooler;
        this.observers = props.observers;
        this.outdoorHumi = null;

        this.init()
    }

    init() {
        this.observers.outdoor.on('change', value => {
            this.outdoorHumi = value;
        });

        this.observers.indoor.on('high', indoorHumi => {
            // start only if outdoor humi is less than indoor
            if (indoorHumi < this.outdoorHumi) {
                this.cooler.turnOn();
            } else {
                // turn on air dryer?
            }
        });

        this.observers.indoor.on('low', () => {
            this.cooler.turnOff();
        });

        this.observers.indoor.on('mid', indoorHumi => {
            // check outside humi to keep indoor humi less wet
            if (this.outdoorHumi >= indoorHumi) {
                this.cooler.turnOff();
            }
        });
    }
}

exports = HumiRegulator;
