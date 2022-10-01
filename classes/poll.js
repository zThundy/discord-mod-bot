class Poll {
    constructor(config, client) {
        this.client = client;
        this.polls = {};
        this.cLoader = client.modules.get("config");
        this.config = this.cLoader.get();
    }

    async createPoll(message, question, options, time) {
        if (options.length < 2) {
            return message.reply("You need at least 2 options for a poll.");
        }
        if (options.length > 10) {
            return message.reply("You can only have up to 10 options for a poll.");
        }
        let poll = {
            question: question,
            options: options,
            votes: new Array(options.length).fill(0),
            voters: [],
            time: time,
            channel: message.channel.id,
            message: null,
            emojis: []
        };
        let msg = await message.channel.send(this.generatePoll(poll));
        for (let i = 0; i < options.length; i++) {
            await msg.react(this.getEmoji(i));
        }
        poll.message = msg.id;
        this.polls[msg.id] = poll;
        setTimeout(() => {
            this.endPoll(msg.id);
        }, time * 1000);
        return msg;
    }

    endPoll(id) {
        if (!this.polls[id]) {
            return;
        }
        let poll = this.polls[id];
        let msg = this.client.channels.get(poll.channel).messages.get(id);
        let results = this.generateResults(poll);
        msg.edit(results);
        delete this.polls[id];
    }

    removePoll(id) {
        if (!this.polls[id]) {
            return;
        }
        let poll = this.polls[id];
        let msg = this.client.channels.get(poll.channel).messages.get(id);
        msg.delete();
        delete this.polls[id];
    }

    generateResults(poll) {
        let results = `**${poll.question}**\n`;
        for (let i = 0; i < poll.options.length; i++) {
            results += `${this.getEmoji(i)} ${poll.options[i]} - ${poll.votes[i]} vote(s)\n`;
        }
        return results;
    }

    generatePoll(poll) {
        let msg = `**${poll.question}**\n\n`;
        for (let i = 0; i < poll.options.length; i++) {
            msg += `${this.getEmoji(i)} ${poll.options[i]}\n`;
        }
        return msg;
    }

    getEmoji(index) {
        return this.config.polls.emojis[index];
    }
}

module.exports = Poll;