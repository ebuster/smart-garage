class DHSensorObserver
{
    constructor(props) {
        this.sensor = props.sensor;
        this.propName = props.propName || 'temp';
        this.limits = props.limits || {min: 0, max: 100};
        this.events = props.events || {low: 'low', high: 'high', mid: 'mid'};
        this.previousValue = null;
        this.sensor.on('update', data => this.update(data));
    }

    emitChange() { // compatible with devices name
        this.sensor.update();
    }

    update(data) {
        const value = data[this.propName];

        if (!value) {
            return;
        }

        this.emit('update', value);

        if (value !== this.previousValue) {
            this.emit('change', value);
            this.previousValue = value;
        }

        if (value <= this.limits.min) {
            this.emit(this.events['low'], value);
        } else if (value >= this.limits.max) {
            this.emit(this.events['high'], value);
        } else {
            this.emit(this.events['mid'], value);
        }
    }
}

exports.create = function create(props) {
    return new DHSensorObserver(props);
};
