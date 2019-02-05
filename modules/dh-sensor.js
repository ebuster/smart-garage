class DHSensor {

    constructor(props) {
        this.sensor = this.connectSensor(props.type, props.pin);

        this.data = {
            temp: 0,
            humi: 0,
        };

        setInterval(() => this.update(), props.interval);
    }

    connectSensor(type, pin) {
        if (type === DHSensor.type.DH22) {
            return require("DHT22").connect(pin);
        }

        // if (type === DHSensor.type.DH11) {
        //     return require('DHT11').connect(pin);
        // }

        //throw new Error(`Unsupported sensor type "${type}"`);
    }

    update() {
        this.sensor.read(data => {
            this.data.temp = data.err ? '' : data.temp.toFixed(1).toString();
            this.data.humi = data.err ? '' : data.rh.toFixed(1).toString();

            this.emit('update', this.data);
        });
    }

}

exports.type = {
    DH22: 'DH22',
    DH11: 'DH11',
};

exports.create = function create(props) {
    return new DHSensor(props);
};

