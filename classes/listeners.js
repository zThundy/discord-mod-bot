const MessageListener = require('../listeners/MessageListener.js');
const ReadyListener = require('../listeners/ReadyListener.js');
const NewUserListener = require('../listeners/NewUserListener.js');
const InteractionListener = require('../listeners/InteractionListener.js');
const GuildCreateListener = require('../listeners/GuildCreateListener.js');
const MessageReactionListener = require('../listeners/MessageReaction.js');

const cLoader = require("../classes/configLoader.js");
const config = new cLoader().getConfig();

class Listeners {
    constructor(client) {
        // const guild = this.client.guilds.cache.get(config.guildId);
        this.listeners = {};
        this.register("messageCreate", new MessageListener(config, client));
        this.register("ready", new ReadyListener(config, client));
        this.register("guildMemberAdd", new NewUserListener(config, client));
        this.register("interactionCreate", new InteractionListener(config, client));
        this.register("guildCreate", new GuildCreateListener(config, client));
        this.register("messageReactionAdd", new MessageReactionListener(config, client));
        this.register("messageReactionRemove", new MessageReactionListener(config, client));
    }

    register(event, listener) {
        console.log(`Registered listener for ${event}`);
        this.listeners[event] = listener;
    }

    call(event, ...args) {
        try {
            console.log("    >> Calling listeners for: " + event);
            if (this.listeners[event])
                this.listeners[event].run(...args);
            else
                console.error("    >> No listener for event: " + event);
        } catch(e) {
            console.error("    >> ERROR ON INTERACTION: " + event);
            console.error(e);
        }
    }
}

module.exports = Listeners;