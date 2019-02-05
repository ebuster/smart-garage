const GSM = require('SIM900');

/*
function oldConnect() {
    console.log("Connecting to SIM900 module");
    const Gsm = GSM.connect(Serial1, P5 /!*reset*!/, function(err) {
        if (err) throw err;
        Gsm.connect('MTS', 'USERNAME', 'PASSWORD', function(err) {
            if (err) throw err;
            Gsm.getIP(function(err, ip) {
                if (err) throw err;
                console.log('IP:' + ip);
                // initBlynk();
            });
        });
    });
}*/

class Gsm {
    constructor(props) {
        this.props = props;
        this.gprs = null;
    }

    connect() {
        // console.log(`GSM: Connecting...`);
        this.gprs = GSM.connect(
            this.props.serialPort,
            this.props.resetPin,
            res => this.handleGSM(res)
        );
    }

    handleGSM(err) {
        if (err) throw err;
        // console.log(`GSM: Connected`);

        this.gprs.connect('MTS', 'mts', 'mts', res => this.handleAPN(res));
    }

    handleAPN(err) {
        if (err) throw err;
        // console.log(`Gsm: Assign IP...`);

        this.gprs.getIP((err, res) => this.handleIP(err, res));
    }

    handleIP(err, ip) {
        if (err) throw err;
        // console.log(`Gsm: ${ip}`);

        this.emit('connected', ip);
    }
}

exports.create = function create(props) {
    return new Gsm(props);
};