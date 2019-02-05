const WiFi = require('wifi'); //const GPRS = require('gprs');
const Blynk = require('blynk'); //const Mqtt = require('mqtt');
const Display = require('display');
const Indicator = require('indicator');
const DHSensor = require('dh-sensor');
const Toggler = require('toggler');
const Heater = require('heater');
const SensorObserver = require('sensor-observer');
// const HumiRegulator = require('humi-regulator');
// const HeatRegulator = require('heat-regulator');

class Garage {
    constructor(cfg) {
        this.cooler = Toggler.create({
            pin: cfg.devices.cooler.pin,
            values: {off: 0, on: 255},
        });

        this.heater = Heater.create({
            lowPin: cfg.devices.heater.low.pin,
            highPin: cfg.devices.heater.high.pin,
        });

        this.indoorSensor = DHSensor.create({
            type: DHSensos.type.DH22,
            pin: cfg.sensors.dh.indoor.pin,
            interval: cfg.sensors.dh.indoor.interval,
        });

        this.outdoorSensor = DHSensor.create({
            type: DHSensor.type.DH22,
            pin: cfg.sensors.dh.outdoor.pin,
            interval: cfg.sensors.dh.outdoor.interval,
        });

        this.display = Display.create({
            port: cfg.devices.display.port,
        }); // todo: pass it to backlight controller

        this.indoorTemp = SensorObserver.create({
            sensor: this.indoorSensor,
            propName: 'temp',
            limits: cfg.limits.temp
        });
        this.indoorHumi = SensorObserver.create({
            sensor: this.indoorSensor,
            propName: 'humi',
            limits: cfg.limits.humi
        });
        this.outdoorTemp = SensorObserver.create({
            sensor: this.outdoorSensor,
            propName: 'temp',
            // limits: { min: -40, max: 40 }
        });
        this.outdoorHumi = SensorObserver.create({
            sensor: this.outdoorSensor,
            propName: 'humi',
            // limits: { min: 0, max: 100 }
        });

         this.blynk = Blynk.create({
             token: cfg.services.blink.token,
             terminalPin: 9
         })
             .addSource(this.indoorTemp, { vpin: 1 })
             .addSource(this.indoorHumi, { vpin: 2 })
             .addSource(this.outdoorTemp, { vpin: 3 })
             .addSource(this.outdoorHumi, { vpin: 4 })
             .addSource(this.heater, { vpin: 5, onWrite: value => this.heater.setPower(value) })
             .addSource(this.cooler, { vpin: 6, onWrite: value => this.cooler.setState(value) });

        this.inet = WiFi.create(cfg.internet.wifi); // GPRS.create(cfg.internet.gprs);
        this.blynk.init(this.inet);
        this.inet.connect();

//        this.mqtt = Mqtt.create(cfg.services.mqtt);
//        this.mqtt.init(this.wifi);
//        this.mqtt.addDevice('cooler', this.cooler);
//        this.wifi.connect();

        Indicator.create({
            display: this.display,
            devices: {
                heater: this.heater,
                cooler: this.cooler,
            },
            sensors: {
                indoor: this.indoorSensor,
                outdoor: this.outdoorSensor,
            },
            services: {
                internet: this.wifi,
                blynk: this.blynk
                // mqtt: this.mqtt,
            }
        });
/*
        HeatRegulator.create({
            heater: this.heater, 
            observers: {
               indoor: this.indoorTemp, 
               outdoor: this.outdoorTemp,
            }
        });
        
        HumiRegulator.create({
            cooler: this.cooler,
            observers: {
                indoor: this.indoorHumi,
                outdoor: this.outdoorHumi,
            }
        });
*/
    }
}

exports.create = function create(props) {
    return new Garage(props);
};
