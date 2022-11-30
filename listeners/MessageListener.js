const { Permissions } = require('discord.js');

class Listener {
    constructor(client) {
        this.cLoader = client.modules.get("config");
        this.config = this.cLoader.get();
        this.reactions = client.modules.get("userReactions");
        this.wordFilter = client.modules.get("wordFilter");
        this.counter = client.modules.get("counter");
        this.hoursCounter = client.modules.get("hourCounter");
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
        // check if the message is a counter
        this.counter.checkCount(message);

        // check if the message is beeing sent from a bot
        if (message.author.bot) return;

        if (message.mentions.users.has(client.user.id)) {
            if (message.content.includes("reaction")) {
                // check if the message is sent from someone that is not an admin
                if (!message.member.permissions.has(Permissions.FLAGS.ADMINISTRATOR)) return;
                this._reactionsCommand(message);
            } else if (message.content.includes("logger")) {
                // check if the message is sent from someone that is not an admin
                if (!message.member.permissions.has(Permissions.FLAGS.ADMINISTRATOR)) return;
                this._loggerCommand(message);
            } else if (message.content.includes("online")) {
                this._onlineHoursCommand(message);
            } else if (message.content.includes("help")) {
                this._helpCommand(message);
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

    _onlineHoursCommand(message) {
        // get the number of hours the user has been online in a voice channel
        const hours = this.hoursCounter.getHours(message.author.id);
        message.reply(`You have been online for **${hours}** hours.`);
    }

    _helpCommand(message) {
        const embed = {
            title: "List of commands",
            description: "This is a list of all the commands that the bot has.",
            fields: [
                {
                    name: "Reaction",
                    value: "This command is used to add or remove reactions from a message. To use this command you need to reply to a message that you want to add reactions to. You can add multiple reactions by separating them with a comma. To remove reactions you need to reply to the message that you want to remove the reactions from."
                },
                {
                    name: "Logger",
                    value: "This command is used to set the channel where the bot will log messages that are deleted. To use this command you need to be in the channel that you want to set as the logger channel. To set the logger channel you need to type `logger set`."
                },
                {
                    name: "Online",
                    value: "This command is used to check how many hours you have been online in a voice channel."
                }
            ],
            color: 0x00ff00,
            footer: {
                text: "Made with ❤️ by zThundy"
            }
        };
        message.reply({ embeds: [embed] });
    }
}

module.exports = Listener;