class HoursCounter {
    constructor(config, client) {
        this.config = config;
        this.db = client.db;
        this.guild = client.guilds.cache.get(this.config.guildId);
        this.counting = {};
        this.seconds = {};

        this.db.getAllHours({ guildId: this.guild.id })
            .then(rows => {
                if (!rows) return;
                for (let row of rows) {
                    this.seconds[row.userId] = row.time;
                }
            });
    }
    
    checkVoiceState(oldState, newState) {
        if (oldState.channel === null && newState.channel !== null) {
            // user is in voice channel, start counting
            console.log(`    >> Started counting for ${newState.member.user.tag}`);
            this.startCounting(newState.member.id);
        } else if (oldState.channel !== null && newState.channel === null) {
            // user is no more in channel, stop counting and save in db
            console.log(`    >> Stopped counting for ${oldState.member.user.tag}`);
            this.stopCounting(oldState.member.id);
        }
    }

    startCounting(userId) {
        if (!this.seconds[userId]) this.seconds[userId] = 0;
        this.counting[userId] = setInterval(() => {
            this.seconds[userId]++;
        }, 1000);
    }

    stopCounting(userId) {
        if (!this.counting[userId]) return;
        clearInterval(this.counting[userId]);
        this.db.updateHours({ guildId: this.guild.id, userId: userId, time: this.seconds[userId] });
    }

    getHours(userId) {
        if (!this.seconds[userId]) this.seconds[userId] = 0;
        // return the number of hours formatted as "hh:mm:ss"
        // the array this.seconds has seconds as value
        let days = Math.floor(this.seconds[userId] / 86400);
        let hours = Math.floor(this.seconds[userId] / 3600);
        let minutes = Math.floor((this.seconds[userId] - (hours * 3600)) / 60);
        let seconds = this.seconds[userId] - (hours * 3600) - (minutes * 60);
        return `${days.toString()} days - ${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")} hours`;
    }
}

module.exports = HoursCounter;