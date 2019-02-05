const net = require('net');
const MqttClient = require('micro-mqtt').Client;
// const MqttClient = require('https://raw.githubusercontent.com/rovale/micro-mqtt/master/espruino/modules/micro-mqtt.js').Client;
// var MqttClient = require("./tinyMQTT");

class MosquitoClient {
    constructor(props) {
        this.props = props;

        this.client = new MqttClient({
            host: props.host,
            clientId: props.clientId,
            username: props.username,
            password: props.password,
            port: props.port,
            will: {
                topic: this.getTopic('status'),
                message: 'offline',
                qos: 1,
                retain: true
            }
        }, net);

        this.isConnecting = null;
        this.telemetryInterval = null;
        this.devices = {};
    }

    init(wifi) {
        wifi.on('connected', () => {
            // print('[Mqtt] [WiFi] Connected');
            this.connect();
        });

        wifi.on('error', () => {
            // print('[Mqtt] [WiFi] Error');
            this.disconnect();
        });

        this.client.on('connected', () => {
            if (this.isConnecting) {
                clearTimeout(this.isConnecting);
            }

            this.emit('connected');

            this.client.subscribe(this.getTopic('command'), 1);

            this.client.publish('status', 'online', 1, true);

            this.telemetryInterval = setInterval(
                () => this.sendTelemetry(),
                60 * 1000
            );
        });

        this.client.on('receive', message => this.processMessage(message));

        // this.client.on('info', (info) => {
            // print('[Mqtt] [Info]', info);
        // });

        // this.client.on('error', (error) => {
            // print('[Mqtt] [Error]', error);
        // });

        this.client.on('disconnected', () => {
            this.emit('disconnected');
            // print('[Mqtt] [Disconnect]');

            if (!this.isConnecting) {
                this.isConnecting  = setTimeout(() => this.connect(), 3000);
            }
        });
    }

    connect() {
        this.isConnecting = true;
        this.client.connect();
    }

    disconnect() {
        if (this.telemetryInterval) {
            clearInterval(this.telemetryInterval);
        }

        this.client.disconnect();
    }

    sendTelemetry() {
        const data = {
            freeMemory: process.memory().free,
        };

        this.client.publish(this.getTopic('telemetry'), JSON.stringify(data), 1);
    }

    getTopic(subj) {
        return `${this.props.topic}/${subj}`;
    }

    publish(topic, payload/*, qos, retain*/) {
        // qos = qos || 0;
        // retain = retain || true;
        this.client.publish(this.getTopic(topic), payload);
    }

    processMessage(msg) {
        // console.log('new message:', message.content);

        // const msg = JSON.parse(message);

        // console.log('msg json', msg);

        switch ( msg.topic ) {
            case 'garage/command':
                this.processCommand(JSON.parse(msg.content));
            break;
        }
    }

    processCommand(cmd) {
        const device = cmd.device;
        const state = cmd.state;

        this.devices[device].setState(state);
    }

    addDevice(name, device) {
        this.devices[name] = device;

        device.on('change', state => {
            this.publish(`device/${name}`, {state: state});
        });

        return this;
    }

}

exports.create = function create(props) {
  return new MosquitoClient(props);
};
