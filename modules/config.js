exports = {
    limits: {
        temp: {
            min: 3,
            max: 7
        },
        humi: {
            min: 50,
            max: 90
        }
    },
    sensors: {
        dh: {
            indoor: {
                pin: P4,
                interval: 30000,
            },
            outdoor: {
                pin: P5,
                interval: 180000
            }
        }
    },
    devices: {
        display: {
            port: PrimaryI2C,
        },
        cooler: {
            pin: P8
        },
        heater: {
            low: {
                pin: P10,
                power: 750
            },
            high: {
                pin: P11,
                power: 1250
            }
        }
    },
    internet: {
        gprs: {
            port: Serial3,
            pins: {
                reset: P0,
                status: P3,
                power: P2,
            }
        },
        wifi: {
            port: PrimarySerial,
            point: {
                ssid: '',
                pass: ''
            }
        }
    },
    services: {
        mqtt: {
            host: 'm21.cloudmqtt.com',
            port: 11883,
            username: '<user>',
            password: '<pass>',
            topic: 'garage',
            clientId: 'iskrajs',
        },
        blink: {
            token: '<your_token>',
        },
        telegram: {
            token: '<bot_key>'
        },
    },
};