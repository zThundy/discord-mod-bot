const MessageListener = require('../listeners/MessageListener.js');
const ReadyListener = require('../listeners/ReadyListener.js');
const UserListener = require('../listeners/UserListener.js');
const InteractionListener = require('../listeners/InteractionListener.js');
const GuildListener = require('../listeners/GuildListener.js');
const MessageReactionListener = require('../listeners/MessageReaction.js');
const RolesListener = require("../listeners/RolesListener.js");

const cLoader = require("../classes/configLoader.js");
const config = new cLoader().getConfig();
const Logger = require("../classes/logger.js");

class Listeners {
    constructor(client) {
        // const guild = this.client.guilds.cache.get(config.guildId);
        this.listeners = {};
        this.register("messageCreate", new MessageListener(config, client));
        this.register("messageDelete", new MessageListener(config, client));
        this.register("messageUpdate", new MessageListener(config, client));
        this.register("ready", new ReadyListener(config, client));
        this.register("guildMemberAdd", new UserListener(config, client));
        this.register("guildMemberRemove", new UserListener(config, client));
        this.register("guildMemberUpdate", new UserListener(config, client));
        this.register("interactionCreate", new InteractionListener(config, client));
        this.register("guildCreate", new GuildListener(config, client));
        this.register("guildDelete", new GuildListener(config, client));
        this.register("guildUpdate", new GuildListener(config, client));
        this.register("messageReactionAdd", new MessageReactionListener(config, client));
        this.register("messageReactionRemove", new MessageReactionListener(config, client));
        this.register("roleCreate", new RolesListener(config, client));
        this.register("roleDelete", new RolesListener(config, client));
        this.register("roleUpdate", new RolesListener(config, client));

        this.logger = new Logger(config, client);
    }

    register(event, listener) {
        console.log(`Registered listener for ${event}`);
        this.listeners[event] = listener;
    }

    call(event, ...args) {
        try {
            if (config.logs.events[event])
                this.logger.log(event);
            console.log("    >> Calling listeners for: " + event);
            if (this.listeners[event])
                this.listeners[event].run(event, ...args);
            else
                console.error("    >> No listener for event: " + event);
        } catch(e) {
            console.error("    >> ERROR ON INTERACTION: " + event);
            console.error(e);
        }
    }
}

module.exports = Listeners;