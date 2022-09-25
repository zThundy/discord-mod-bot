const MessageListener = require('../listeners/MessageListener.js');
const ReadyListener = require('../listeners/ReadyListener.js');
const UserListener = require('../listeners/UserListener.js');
const InteractionListener = require('../listeners/InteractionListener.js');
const GuildListener = require('../listeners/GuildListener.js');
const MessageReactionListener = require('../listeners/MessageReaction.js');
const RolesListener = require("../listeners/RolesListener.js");
const VoiceStateUpdate = require("../listeners/VoiceListener.js");
const ChannelListener = require("../listeners/ChannelListener.js");

const cLoader = require("../classes/configLoader.js");
const config = new cLoader().get();
const Logger = require("../classes/logger.js");

class Listeners {
    constructor(client) {
        // const guild = this.client.guilds.cache.get(config.guildId);
        this.listeners = {};
        this.register("messageCreate", new MessageListener(client));
        this.register("messageDelete", new MessageListener(client));
        this.register("messageUpdate", new MessageListener(client));
        this.register("ready", new ReadyListener(client));
        this.register("guildMemberAdd", new UserListener(client));
        this.register("guildMemberRemove", new UserListener(client));
        this.register("guildMemberUpdate", new UserListener(client));
        this.register("interactionCreate", new InteractionListener(client));
        this.register("guildCreate", new GuildListener(client));
        this.register("guildDelete", new GuildListener(client));
        this.register("guildUpdate", new GuildListener(client));
        this.register("messageReactionAdd", new MessageReactionListener(client));
        this.register("messageReactionRemove", new MessageReactionListener(client));
        this.register("roleCreate", new RolesListener(client));
        this.register("roleDelete", new RolesListener(client));
        this.register("roleUpdate", new RolesListener(client));
        this.register("voiceStateUpdate", new VoiceStateUpdate(client));
        this.register("channelCreate", new ChannelListener(client));
        this.register("channelDelete", new ChannelListener(client));
        this.register("channelUpdate", new ChannelListener(client));

        this.logger = new Logger(client);
    }

    register(event, listener) {
        console.log(`Registered listener for ${event}`);
        this.listeners[event] = listener;
    }

    call(event, ...args) {
        try {
            if (config.logs.events[event])
                this.logger.run(event, ...args);
            console.log("    >> Calling listeners for: " + event);
            if (this.listeners[event])
                this.listeners[event].run(event, ...args);
            else
                console.error("         >> No listener for event: " + event);
        } catch(e) {
            console.error("         >> ERROR ON INTERACTION: " + event);
            console.error(e);
        }
    }
}

module.exports = Listeners;