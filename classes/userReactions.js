class Reactions {
    constructor(config, client) {
        this.db = client.db;
        this.client = client;
        this.db.getReactions()
            .then(reactions => {
                this.reactions = reactions;
                reactions.forEach(reaction => {
                    client.guilds.fetch(reaction.guildId)
                        .then(guild => {
                            guild.channels.fetch(reaction.channelId)
                                .then(channel => {
                                    channel.messages.fetch(reaction.messageId)
                                        .catch(() => this.__handleError(reaction.guildId, reaction.channelId, reaction.messageId));
                                })
                                .catch(() => this.__handleError(reaction.guildId, reaction.channelId, reaction.messageId));
                        })
                        .catch(() => this.__handleError(reaction.guildId, reaction.channelId, reaction.messageId));
                });
        });
    }

    __handleError(guildId, channelId, messageId) {
        this.db.removeReaction({
            guildId: guildId,
            channelId: channelId,
            messageId: messageId
        });
    }

    getReaction(guildId, channelId, messageId) {
        return this.reactions.find(reaction => reaction.guildId === guildId && reaction.channelId === channelId && reaction.messageId === messageId);
    }

    add(message, data) {
        /**
         * @param {STRING} data.reactions
         * @param {STRING} data.guildId
         * @param {STRING} data.channelId
         * @param {STRING} data.messageId
         */
        if (!data.guildId || !data.channelId || !data.messageId) return;
        for (var i in this.reactions) {
            if (this.reactions[i].guildId === data.guildId && this.reactions[i].channelId === data.channelId && this.reactions[i].messageId === data.messageId) {
                message.reply("This reaction already exists.")
                    .then(msg => {
                        message.delete();
                        setTimeout(() => msg.delete(), 5000);
                    });
                return;
            }
        }
        this.client.guilds.fetch(data.guildId)
            .then(guild => {
                guild.channels.fetch(data.channelId)
                    .then(channel => {
                        channel.messages.fetch(data.messageId)
                            .then(message => {
                                for (var i in JSON.parse(data.reactions)) {
                                    message.react(JSON.parse(data.reactions)[i][1]);
                                }
                            })
                            .catch(console.error);
                    })
                    .catch(console.error);
            })
            .catch(console.error);
        this.reactions.push(data);
        this.db.addReaction(data);
    }

    remove(message, data) {
        /**
         * @param {STRING} data.guildId
         * @param {STRING} data.channelId
         * @param {STRING} data.messageId
         */
        if (!data.guildId || !data.channelId || !data.messageId) return;
        for (var i in this.reactions) {
            if (this.reactions[i].guildId === data.guildId && this.reactions[i].channelId === data.channelId && this.reactions[i].messageId === data.messageId) {
                this.reactions.splice(i, 1);
                this.db.removeReaction({
                    guildId: data.guildId,
                    channelId: data.channelId,
                    messageId: data.messageId
                });
                return;
            }
        }
        message.reply("This reaction does not exists.")
            .then(msg => {
                setTimeout(() => msg.delete(), 5000);
            });
    }

    createArray(message) {
        message = message.trim();
        var array = message.split(" ");
        if (!array[0] || array[0].length === 0) return "You need to provide at least one role/emoji combination.";
        if (array.length % 2 !== 0) return "Please choose a combination of role/emoji.";

        var newArray = [];
        for (var i = 0; i <= array.length; i += 2) {
            if (array[i] && array[i + 1]) {
                array[i] = array[i].replace(/[\\<>@#&!]/g, "").trim();
                newArray.push([array[i], array[i + 1]]);
            }
        }

        /*
            [
                ["🇦", "🇦"],
                ["🇧", "🇧"],
            ]
        */
        for (var i in newArray) {
            // if there are multiple elements in the array
            i = Number(i);
            if (newArray[i + 1]) {
                if (newArray[i][0] === newArray[i + 1][0]) return "Please choose different emotes and roles.";
                if (newArray[i][1] === newArray[i + 1][1]) return "Please choose different emotes and roles.";
            }
        }
        return newArray;
    }
}

module.exports = Reactions;