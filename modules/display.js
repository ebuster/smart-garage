class Display {
    constructor(props) {
        props.port.setup({sda: SDA, scl: SCL});
        this.lcd = require("HD44780").connectI2C(props.port, 0x38);
        this.init();
    }

    init() {
        this.print('C --.- --.- x   ', 0, 0);
        this.print('% --.- --.- • __', 0, 1);
    }

    indoorTemp(value) {
        this.print(this.parseSensorVal(value), 2, 0);
    }

    indoorHumi(value) {
        this.print(this.parseSensorVal(value), 2,1);
    }

    outdoorTemp(value) {
        this.print(this.parseSensorVal(value) , 7,0);
    }

    outdoorHumi(value) {
        this.print(this.parseSensorVal(value), 7,1);
    }

    heaterPower(power) {
        this.print(power ? power : 'x   ', 12,0);
    }

    coolerState(state) {
        this.print(state ? '*' : '•', 12,1);
    }

    online(state) {
        this.print(state,14,1);
    }

    sync(state) {
        this.print(state,15,1);
    }

    print(text, pos, line) {
        this.lcd.setCursor(pos || 0, line || 0);
        this.lcd.print(text.toString());

        return this;
    }

    parseSensorVal(val) {
        return val ? val : '--.-';
    }
}

exports.create = function create(props) {
    return new Display(props);
};