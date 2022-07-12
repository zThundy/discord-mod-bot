if (!String.prototype.format) {
    String.prototype.format = function() {
        var args = arguments;
        return this.replace(/{(\d+)}/g, function(match, number) { 
            return typeof args[number] != 'undefined' ? args[number] : match;
        });
    };
}

class Renamer {
    constructor(config, client) {
        this.config = config;
        // client.db.getNicknames()
        //     .then(nicks => {    
        //         this.nicks = nicks;
        //         client.guilds.fetch(this.config.guildId)
        //             .then(guild => {
        //                 guild.members.cache.forEach(member => {
        //                     if (member.user.bot) return;
        //                 });
        //             })
        //             .catch(console.error);
        //     });
        // if (!this.config.nicknames.enabled) return;
        // client.guilds.fetch(this.config.guildId)
        //     .then(guild => {
        //         guild.members.cache.forEach(member => {
        //             if (member.user.bot) return;
        //             this.config.nicknames.roles.forEach((role, prefix) => {
        //                 console.log(role, prefix);
        //                 if (member.roles.cache.has(role)) {
        //                     member.setNickname(prefix.format(member.user.username));
        //                 }
        //             });
        //         });
        //     });
    }
}

module.exports = Renamer;