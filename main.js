const cLoader = require("./classes/configLoader.js");
const config = new cLoader().getConfig();
const db = require("./classes/database.js");
const sql = new db(config);

const discord = require("discord.js");

// create a new Discord client
const client = new discord.Client({
    intents: [
        "GUILDS",
        "GUILD_MEMBERS",
        "GUILD_BANS",
        "GUILD_EMOJIS_AND_STICKERS",
        "GUILD_INTEGRATIONS",
        "GUILD_WEBHOOKS",
        "GUILD_INVITES",
        "GUILD_VOICE_STATES",
        "GUILD_PRESENCES",
        "GUILD_MESSAGES",
        "GUILD_MESSAGE_REACTIONS",
        "GUILD_MESSAGE_TYPING",
        "DIRECT_MESSAGES",
        "DIRECT_MESSAGE_REACTIONS",
        "DIRECT_MESSAGE_TYPING",
        "GUILD_SCHEDULED_EVENTS"
    ]
});

// autenticate the discord client
client.login(config.token)
    .then(() => {
        client.config = config;
        client.db = sql;
        
        // map with all modules
        client.modules = new Map();
        const Reactions = require("./classes/userReactions.js")
        client.modules.set("userReactions", new Reactions(config, client));
        const ChannelCounter = require("./classes/userCount.js");
        client.modules.set("userCount", new ChannelCounter(config, client));
        const UserRenamer = require("./classes/userRenamer.js");
        client.modules.set("userRenamer", new UserRenamer(config, client));
        const WordFilter = require("./classes/wordFilter.js");
        client.modules.set("wordFilter", new WordFilter(config, client));

        const Listener = require("./classes/listeners.js");
        const listeners = new Listener(client);
        
        // better to call this here than using the actual event
        listeners.call("ready", client);
        // client.on("ready", () => listeners.call("ready", client));
        // messages handler
        client.on("messageCreate", (message) => listeners.call("messageCreate", client, message));
        client.on("messageUpdate", (oldMessage, newMessage) => listeners.call("messageUpdate", client, oldMessage, newMessage));
        client.on("messageDelete", (message) => listeners.call("messageDelete", client, message));
        // guild member events
        client.on("guildMemberAdd", (user) => listeners.call("guildMemberAdd", client, user));
        client.on("guildMemberRemove", (user) => listeners.call("guildMemberRemove", client, user));
        client.on("guildMemberUpdate", (oldUser, newUser) => listeners.call("guildMemberUpdate", client, oldUser, newUser));
        // role events
        client.on("roleCreate", (role) => listeners.call("roleCreate", client, role));
        client.on("roleDelete", (role) => listeners.call("roleDelete", client, role));
        client.on("roleUpdate", (oldRole, newRole) => listeners.call("roleUpdate", client, oldRole, newRole));
        // channel events
        client.on("channelCreate", (channel) => listeners.call("channelCreate", client, channel));
        client.on("channelDelete", (channel) => listeners.call("channelDelete", client, channel));
        client.on("channelUpdate", (oldChannel, newChannel) => listeners.call("channelUpdate", client, oldChannel, newChannel));
        // guild events
        client.on("guildCreate", (guild) => listeners.call("guildCreate", client, guild));
        client.on("guildDelete", (guild) => listeners.call("guildDelete", client, guild));
        client.on("guildUpdate", (oldGuild, newGuild) => listeners.call("guildUpdate", client, oldGuild, newGuild));
        // interactions
        client.on("interactionCreate", (interaction) => listeners.call("interactionCreate", client, interaction));
        // message reactions
        client.on("messageReactionAdd", (reaction, user) => listeners.call("messageReactionAdd", client, reaction, user));
        client.on("messageReactionRemove", (reaction, user) => listeners.call("messageReactionRemove", client, reaction, user));
        // voice states
        client.on("voiceStateUpdate", (oldState, newState) => listeners.call("voiceStateUpdate", client, oldState, newState));
    });