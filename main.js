const cLoader = require("./classes/configLoader.js");
const config = new cLoader().getConfig();
const Listener = require("./classes/listeners.js");
const listeners = new Listener();

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
})
// autenticate the discord client
client.login(config.token);
client.config = config;

client.on("ready", () => listeners.call("ready", client));
client.on("messageCreate", (message) => listeners.call("messageCreate", client, message));
client.on("guildMemberAdd", (user) => listeners.call("guildMemberAdd", client, user));
client.on("interactionCreate", (interaction) => listeners.call("interactionCreate", client, interaction));
client.on("guildCreate", (guild) => listeners.call("guildCreate", client, guild));