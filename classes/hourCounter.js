class HoursCounter {
    constructor(config, client) {
        this.config = config;
        this.db = client.db;
        this.guild = client.guilds.cache.get(this.config.guildId);
        this.counting = {};

        this.db.getAllHours({ guildId: this.guild.id })
            .then(rows => {
                for (let row of rows) {
                    this.hours[row.userId] = row.time;
                }
            });
    }
    
    checkVoiceState(oldState, newState) {
        if (oldState.channel === null && newState.channel !== null) {
            // user is in voice channel, start counting
            this.startCounting(newState.member.id);
        } else if (oldState.channel !== null && newState.channel === null) {
            // user is no more in channel, stop counting and save in db
            this.stopCounting(oldState.member.id);
        }
    }

    startCounting(userId) {
        this.hours[userId] = 0;
        this.counting[userId] = setInterval(() => {
            this.hours[userId]++;
        }, 1000);
    }

    stopCounting(userId) {
        clearInterval(this.counting[userId]);
        this.db.updateHours({ guildId: this.guild.id, userId: userId, time: this.hours[userId] });
    }

    getHours(userId) {
        // return the number of hours formatted as hh:mm:ss
        // the array this.hours has seconds as value
        let hours = Math.floor(this.hours[userId] / 3600);
        let minutes = Math.floor((this.hours[userId] - (hours * 3600)) / 60);
        let seconds = this.hours[userId] - (hours * 3600) - (minutes * 60);
        return `${hours}:${minutes}:${seconds}`;
    }
}

module.exports = HoursCounter;