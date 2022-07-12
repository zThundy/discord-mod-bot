class Listener {
    constructor(config, client) {
        this.config = config;
        this.reactions = client.modules.get("userReactions");
    }

    run(client, adding, reaction, user) {
        if (user.id === client.user.id) return;
        if (user.bot) return;

        const _reaction = this.reactions.getReaction(reaction.message.guild.id, reaction.message.channel.id, reaction.message.id)
        if (adding) {
            if (_reaction.reactions) {
                _reaction.reaction = JSON.parse(_reaction.reactions);
                _reaction.reaction.forEach(r => {
                    if (reaction._emoji.name === r[1]) {
                        reaction.message.guild.members.fetch(user.id)
                            .then(member => {
                                reaction.message.guild.roles.fetch(r[0])
                                    .then(role => {
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
                _reaction.reaction = JSON.parse(_reaction.reactions);
                _reaction.reaction.forEach(r => {
                    if (reaction._emoji.name === r[1]) {
                        reaction.message.guild.members.fetch(user.id)
                            .then(member => {
                                reaction.message.guild.roles.fetch(r[0])
                                    .then(role => {
                                        member.roles.remove(role)
                                    })
                                    .catch(console.error);
                            })
                            .catch(console.error);;
                    }
                });
            }
        }
    }
}

module.exports = Listener;