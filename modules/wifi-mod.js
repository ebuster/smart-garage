const WiFiModule = require('@amperka/wifi');

class WifiMod {
    constructor(props) {
        this.props = props;
        this.props.port.setup(115200);
    }

    init(cb) {
        this.wifi = WiFiModule.setup(this.props.port, err => {
            if (err) throw err;

            this.wifi.on('err', function(error) {
                this.emit('error', error);
            });

            cb(this.wifi);
        });
    }

    connect() {
        this.wifi.connect(this.props.creds.ssid, this.props.creds.pass, err => {
            if (err) throw err;

            // this.wifi.getIP((err, ip) => {
            //     this.emit('connected', { ip: ip });
            // });

            this.emit('connected', { ip: ip });
        });

        return this.wifi;
    }

    // getDetails() {
    //     return this.wifi.getDetails();
    // }
}

exports.create = function create(props) {
    return new WifiMod(props);
};
