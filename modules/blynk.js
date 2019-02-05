const BlynkLib = require('http://tiny.cc/blynk-js');

class Blynk {
    constructor(props) {
        this.props = props;
        this.sources = [];
        this.vpins = {};
    }

    init(inet) {
        this.blynk = new BlynkLib.Blynk(this.props.token, {skip_connect: true});

        this.blynk.on('connect', () => {
            this.emit('connected');

            this.sources.forEach( source => this.registerSource(source));
            this.sources = [];
        });

        this.blynk.on('disconnect', () => {
            this.emit('disconnected');
        });

        inet.on('connected', () => {
            this.blynk.connect();
        });
    }


    addSource(source, opts) {
        this.sources.push({
            observer: source,
            vpin: opts.vpin,
            write: opts.onWrite
        });

        return this;
    }

    registerSource(source) {
        if (!this.vpins[source.vpin]) {
            const virtualPin = new this.blynk.VirtualPin(source.vpin);

            this.vpins[source.vpin] = virtualPin;

            if (source.write) {
                virtualPin.on('write', value => source.write(value[0]));
            }
        } /*else {
            throw new Error(`Pin ${source.vpin} already used`);
        }*/

        source.observer.on('change', state => {
            this.vpins[source.vpin].write(state);
        });

        source.observer.emitChange();
    }

}

exports.create = function create(props) {
    return new Blynk(props);
};