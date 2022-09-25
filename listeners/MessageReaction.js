class Listener {
    constructor(client) {
        this.cLoader = client.modules.get("config");
        this.config = this.cLoader.get();
        this.reactions = client.modules.get("userReactions");
    }

    run(event, client, reaction, user) {
        // check if the reaction module is enabled in the config file
        if (!this.config.userReactions.enabled) return;
        // check if the reaction is from the bot
        if (user.id === client.user.id) return;
        // check if the reaction is from A bot
        if (user.bot) return;

        switch(event) {
            case "messageReactionAdd":
                this.messageReactionAdd(client, reaction, user);
                break;
            case "messageReactionRemove":
                this.messageReactionRemove(client, reaction, user);
                break;
        }
    }

    messageReactionAdd(client, reaction, user) {
        // get the reaction from the userReaction module
        const _reaction = this.reactions.getReaction(reaction.message.guild.id, reaction.message.channel.id, reaction.message.id);
        if (!_reaction) return;
        // check if the reaction exists
        if (_reaction.reactions) {
            if (typeof _reaction.reactions === "string") _reaction.reactions = JSON.parse(_reaction.reactions);
            _reaction.reactions.forEach(r => {
                // check what emoji the user is clicking
                if (reaction._emoji.name === r[1]) {
                    reaction.message.guild.members.fetch(user.id)
                        .then(member => {
                            reaction.message.guild.roles.fetch(r[0])
                                .then(role => {
                                    // assign the role to the user
                                    member.roles.add(role);
                                })
                                .catch(console.error);
                        })
                        .catch(console.error);
                }
            });
        }
    }

    messageReactionRemove(client, reaction, user) {
        // get the reaction from the userReaction module
        const _reaction = this.reactions.getReaction(reaction.message.guild.id, reaction.message.channel.id, reaction.message.id);
        if (!_reaction) return;
        // check if the reaction exists
        if (_reaction.reactions) {
            if (typeof _reaction.reactions === "string") _reaction.reactions = JSON.parse(_reaction.reactions);
            _reaction.reactions.forEach(r => {
                if (reaction._emoji.name === r[1]) {
                    reaction.message.guild.members.fetch(user.id)
                        .then(member => {
                            reaction.message.guild.roles.fetch(r[0])
                                .then(role => {
                                    // remove the role from the user
                                    member.roles.remove(role);
                                })
                                .catch(console.error);
                        })
                        .catch(console.error);
                }
            });
        }
    }
}

module.exports = Listener;