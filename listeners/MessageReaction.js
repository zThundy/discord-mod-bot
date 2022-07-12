class Listener {
    constructor(config, client) {
        this.config = config;
        this.reactions = client.modules.get("userReactions");
    }

    run(client, adding, reaction, user) {
        // check if the reaction module is enabled in the config file
        if (!this.config.userReactions.enabled) return;
        // check if the reaction is from the bot
        if (user.id === client.user.id) return;
        // check if the reaction is from A bot
        if (user.bot) return;
        // get the reaction from the userReaction module
        const _reaction = this.reactions.getReaction(reaction.message.guild.id, reaction.message.channel.id, reaction.message.id);
        // check if the reaction is adding or removing
        if (adding) {
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
                                        member.roles.add(role)
                                    })
                                    .catch(console.error);
                            })
                            .catch(console.error);;
                    }
                });
            }
        } else {
            if (_reaction.reactions) {
                if (typeof _reaction.reactions === "string") _reaction.reactions = JSON.parse(_reaction.reactions);
                _reaction.reactions.forEach(r => {
                    if (reaction._emoji.name === r[1]) {
                        reaction.message.guild.members.fetch(user.id)
                            .then(member => {
                                reaction.message.guild.roles.fetch(r[0])
                                    .then(role => {
                                        // remove the role from the user
                                        member.roles.remove(role)
                                    })
                                    .catch(console.error);
                            })
                            .catch(console.error);
                    }
                });
            }
        }
    }
}

module.exports = Listener;