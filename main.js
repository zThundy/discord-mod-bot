const config = require("./config.json");
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

client.on("ready", () => {
    console.log("I am ready!");
});

client.on("message", (message) => {
    if (message.content === "ping") {
        message.reply("pong");
    }
});

client.on("interaction", (interaction) => {
    
});
