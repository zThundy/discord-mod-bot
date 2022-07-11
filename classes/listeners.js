const MessageListener = require('../listeners/MessageListener.js');
const ReadyListener = require('../listeners/ReadyListener.js');
const NewUserListener = require('../listeners/NewUserListener.js');
const InteractionListener = require('../listeners/InteractionListener.js');
const GuildCreateListener = require('../listeners/GuildCreateListener.js');

const cLoader = require("../classes/configLoader.js");
const config = new cLoader().getConfig();

class Listeners {
    constructor() {
        this.listeners = {};
        this.register("messageCreate", new MessageListener(config));
        this.register("ready", new ReadyListener(config));
        this.register("guildMemberAdd", new NewUserListener(config));
        this.register("interactionCreate", new InteractionListener(config));
        this.register("guildCreate", new GuildCreateListener(config));
    }

    register(event, listener) {
        console.log(`Registered listener for ${event}`);
        this.listeners[event] = listener;
    }

    call(event, ...args) {
        try {
            console.log("Calling listeners for " + event);
            if (this.listeners[event])
                this.listeners[event].run(...args);
            else
                console.error("No listener for " + event);
        } catch(e) {
            console.error("ERROR ON INTERACTION: " + event);
            console.error(e);
        }
    }
}

module.exports = Listeners;