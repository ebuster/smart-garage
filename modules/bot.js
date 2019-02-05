
class TelegramBot {
    constructor(props) {
        this.bot = require('@amperka/telegram').create({
            token: props.token,
            polling: { timeout: 10 }
        });
        this.init();
    }

    connect() {
        this.bot.connect();
    }

    init() {
        this.bot.on('/start', msg => {
            const keyboard = bot.keyboard([
                ['/TurnHeaterLowOn', '/TurnHeaterLowOff'],
                ['/TurnHeaterHigOn', '/TurnHeaterHighOff'],
                ['/TurnCoolerOn', '/TurnHeaterCoolerOff'],
            ], { resize: true }
            );
            this.bot.sendMessage(msg.from.id, 'Heater Control', {
                markup: keyboard
            });
        });

        this.bot.on('/TurnCoolerOn', msg => {
            this.emit('switch-cooler', true);
            this.bot.sendMessage(msg.from.id, 'Cooler: ON');
        });

        this.bot.on('/TurnCoolerOff', msg => {
            this.emit('switch-cooler', false);
        });

        this.bot.on('/TurnHeaterLowOn', msg => {
            this.emit('switch-heater-low', true);
        });

        this.bot.on('/TurnHeaterLowOff', msg => {
            this.emit('switch-heater-low', false);
        });

        this.bot.on('/TurnHeaterHighOn', msg => {
            this.emit('switch-heater-high', true);
        });

        this.bot.on('/TurnHeaterHighOff', msg => {
            this.emit('switch-heater-high', false);
        });
    }
}

exports.create = function create(props) {
  return new TelegramBot(props);
};