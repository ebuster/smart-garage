class HeatRegulator
{
    constructor(props) {
        this.heater = props.heater;
        this.observers = props.observers;
        this.outdoorTemp = null;
        this.init()
    }

    init() {
        this.observer.outdoor.on('change', value => {
            this.outdoorTemp = value;
        });

        this.observer.indoor.on('high', indorTemp => {
            this.heater.turnOff();
        });

        this.observer.indoor.on('low', indorTemp => {
            //if (this.heater.isFullPower()) {
                // todo: measure heating time and send alarm if power is not enough to make warm inside
            //}
            this.heater.turnOn();
        });
    }
}


exports.create = function create(props){
    return new HeatRegulator(props);
};
