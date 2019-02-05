const Gsm = require('gsm');
const Sim = require('sim');

class Gprs
{
    constructor(props) {
        this.props = props;
    }

    connect() {
        const gsm = new Gsm({
            resetPin: this.props.pins.reset,
            serialPort: this.props.port
        });

        gsm.on('connected', ip => {
            this.emit('connected', ip);
        });

        const sim = new Sim({
            powerPin: this.props.pins.power,
            statusPin: this.props.pins.status
        });

        sim.on('powerOn', () => {
            setTimeout(() => gsm.connect(), 5000);
        });

        sim.powerOn();
    }
}

exports.create = function create(props) {
    return new Gprs(props);
};

