class Reactions {
    constructor(config, client) {
        this.db = client.db;
        this.db.getReactions().then(reactions => {
            this.reactions = reactions;
        });
    }

    update(guild) {

    }

    add(message, data) {
        /**
         * @param {STRING} data.guildId
         * @param {STRING} data.channelId
         * @param {STRING} data.messageId
         */
        if (!data.guildId || !data.channelId || !data.messageId) return;
        for (var i in this.reactions) {
            if (this.reactions[i].guildId === data.guildId && this.reactions[i].channelId === data.channelId && this.reactions[i].messageId === data.messageId) {
                message.reply("This reaction already exists.")
                    .then(msg => {
                        setTimeout(() => msg.delete(), 5000);
                    });
                return;
            }
        }
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
}

module.exports = Reactions;