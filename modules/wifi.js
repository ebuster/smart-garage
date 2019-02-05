class WiFi {

    constructor(props) {
        this.props = props;
        this.props.port.setup(115200);
    }

    connect() {
        this.wifi = require('@amperka/wifi').setup(this.props.port, err => {
            if (err) throw err;

            this.wifi.connect(this.props.point.ssid, this.props.point.pass, err => {
                if (err) throw err;
                this.emit('connected');
            });

            this.wifi.on('err', function(error) {
                this.emit('error', error);
            });
        });

        return this.wifi;
    }
}

exports.create = function create(props) {
    return new WiFi(props);
};
