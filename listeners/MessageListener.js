const { Permissions } = require('discord.js');

class Listener {
    constructor(client) {
        this.cLoader = client.modules.get("config");
        this.config = this.cLoader.get();
        this.reactions = client.modules.get("userReactions");
        this.wordFilter = client.modules.get("wordFilter");
        this.polls = client.modules.get("polls");
    }

    run(event, ...args) {
        switch(event) {
            case "messageCreate":
                this.messageCreate(...args);
                break;
            case  "messageDelete":
                this.messageDelete(...args);
                break;
            case "messageUpdate":
                this.messageUpdate(...args);
                break;
        }
    }

    messageCreate(client, message) {
        // check if the message is from the configured guild
        if (message.guild.id !== this.config.guildId) return;
        // check if the word filter is enabled in the config file
        if (this.config.wordsFilter.enabled) if (!this.wordFilter.checkMessage(message)) return;

        // check if the message is beeing sent from a bot
        if (message.author.bot) return;
        // check if the message is sent from someone that is not an admin
        if (!message.member.permissions.has(Permissions.FLAGS.ADMINISTRATOR)) return;

        if (message.mentions.users.has(client.user.id)) {
            if (message.content.includes("reaction")) {
                this._reactionsCommand(message);
            } else if (message.content.includes("logger")) {
                this._loggerCommand(message);
            } else if (message.content.includes("poll")) {
                this._pollCommand(message);
            }
        }
    }

    messageDelete(client, message) {
        // check if the message is from the configured guild
        if (message.guild.id !== this.config.guildId) return;
    }

    messageUpdate(client, oldMessage, newMessage) {
        // check if the message is from the configured guild
        if (oldMessage.guild.id !== this.config.guildId) return;
    }

    _reactionsCommand(message) {
        if (message.type === "REPLY") {
            // split the command
            message.content = message.content.split("reaction")[1];
            message.content = message.content.trim();
            // get the action that the user is trying to do
            var action = "";
            if (message.content.includes("add") || message.content.includes("new")) action = "add";
            if (message.content.includes("remove") || message.content.includes("delete")) action = "remove";
            // apply logic to the action
            switch(action) {
                case "add":
                    message.content = message.content.split("add");
                    var reactions = this.reactions.createArray(message.content[1]);
                    if (typeof reactions === "string") {
                        return message.reply(reactions)
                            .then(msg => {
                                message.delete();
                                setTimeout(() => msg.delete(), 10000);
                            });
                    }
                    this.reactions.add(message, {
                        guildId: message.guild.id,
                        channelId: message.channel.id,
                        messageId: message.reference.messageId,
                        reactions: JSON.stringify(reactions)
                    });
                    break;

                case "remove":
                    message.content = message.content.split("remove")[1];
                    this.reactions.remove(message, {
                        guildId: message.guild.id,
                        channelId: message.channel.id,
                        messageId: message.reference.messageId
                    });
                    break;
            }
        } else {
            message.reply("You can only use this command in a reply.")
                .then(msg => {
                    setTimeout(() => msg.delete(), 5000);
                });
        }
    }

    _loggerCommand(message) {
        message.content = message.content.split("logger")[1];
        message.content = message.content.trim();

        if (message.content.includes("set")) {
            try {
                const channelId = message.channel.id;
                this.cLoader.set(channelId, "logs", "channelId");
                this.cLoader.reload();
                this.config = this.cLoader.get();
                message.reply("The logger channel has been set to this channel.")
                    .then(msg => {
                        setTimeout(() => msg.delete(), 5000);
                    });
            } catch(e) {
                console.log(e);
                message.reply("There was an error setting the logger channel.")
                    .then(msg => {
                        setTimeout(() => msg.delete(), 5000);
                    });
            }
        }
    }
    
    async _pollCommand(message) {
        if (!this.config.polls.enabled) return
        if (this.config.polls.channelId !== message.channel.id) return message.reply("You can only use this command in the polls channel.");

        message.content = message.content.split("poll")[1];
        message.content = message.content.trim();
        
        var action = "";
        if (message.content.includes("create") || message.content.includes("new")) action = "add";
        if (message.content.includes("remove") || message.content.includes("delete")) action = "remove";
        if (message.content.includes("vote")) action = "vote";

        switch(action) {
            case "add":
                message.content = message.content.split("add")[1];
                message.content = message.content.trim();

                var messages = [];
                var options = null;
                let _m = await message.channel.send("What are the options for the poll? (separate them with a comma)");
                messages.push(_m);

                const filter = m => m.author.id === message.author.id;
                const collector = message.channel.createMessageCollector(filter, { time: 60000 });
                collector.on("collect", async m => {
                    options = m.content.split(",");
                    collector.stop();
        
                    _m = await message.channel.send("Do you want to set a time limit for the poll? (y/n)");
                    messages.push(_m);
                    const collector2 = message.channel.createMessageCollector(filter, { time: 60000 });
                    collector2.on("collect", async m => {
                        switch(m.content.toLowerCase()) {
                            case "y":
                                _m = message.channel.send("How long do you want the poll to last? (in minutes)");
                                messages.push(_m);
                                const collector3 = message.channel.createMessageCollector(filter, { time: 60000 });
                                collector3.on("collect", m => {
                                    var time = parseInt(m.content);
                                    if (isNaN(time)) return message.reply("That is not a valid number.");
                                    if (time < 1) return message.reply("The time limit must be at least 1 minute.");
                                    if (time > 60) return message.reply("The time limit must be less than 60 minutes.");
                                    collector3.stop();

                                    messages.forEach(m => m.delete());
                                    this.polls.createPoll(message, message.content, options, time);
                                });
                                break;
                            case "n":
                                collector2.stop();
                                messages.forEach(m => m.delete());
                                this.polls.createPoll(message, message.content, options, 0);
                                break;
                            default:
                                messages.forEach(m => m.delete());
                                message.reply("That is not a valid option.")
                                    .then(msg => {
                                        setTimeout(() => msg.delete(), 5000);
                                    });
                                break;
                        }
                    });
                });
                break;

            case "remove":
                message.content = message.content.split("remove")[1];
                message.content = message.content.trim();
                this.polls.removePoll(message, message.content);
                break;

            case "vote":
                message.content = message.content.split("vote")[1];
                this.polls.vote(message, {
                    guildId: message.guild.id,
                    channelId: message.channel.id,
                    messageId: message.reference.messageId,
                    vote: message.content
                });
                break;

        }
    }
}

module.exports = Listener;