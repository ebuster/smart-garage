class Indicator
{
    constructor(props) {
        this.display = props.display;
        this.devices = props.devices || {};
        this.sensors = props.sensors || {};
        this.services = props.services || {};

        this.init();
    }

    init() {
        this.sensors.indoor.on('update', data => {
            this.display.indoorTemp(data.temp);
            this.display.indoorHumi(data.humi);
        });

        this.sensors.outdoor.on('update', data => {
            this.display.outdoorTemp(data.temp);
            this.display.outdoorHumi(data.humi);
        });

        this.devices.heater.on('change', power => {
            this.display.heaterPower(power);
        });

        this.devices.cooler.on('change', state => {
            this.display.coolerState(state);
        });

        this.services.internet.on('connected', () => {
            this.display.online('I');
        });

        this.services.internet.on('error', error => {
            this.display.online('e');
        });

        if (this.services.blynk) {
            this.services.blynk.on('connected', () => {
                this.display.sync('B');
            });
            this.services.blynk.on('disconnected', () => {
                this.display.sync('_');
            });
        }

        if (this.services.mqtt) {
            this.services.mqtt.on('connected', () => {
                this.display.sync('M');
            });
            this.services.mqtt.on('disconnected', () => {
                this.display.sync('_');
            });
        }

    }

}

exports.create = function create(props) {
    return new Indicator(props);
};