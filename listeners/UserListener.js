class Listener {
    constructor(client) {
        this.cLoader = client.modules.get("config");
        this.config = this.cLoader.get();
    }

    run(event, client, user) {
        switch(event) {
            case "guildMemberAdd":
                this.guildMemberAdd(client, user);
                break;
            case "guildMemberRemove":
                // this.guildMemberRemove(client, user);
                break;
            case "guildMemberUpdate":
                // this.guildMemberUpdate(client, user);
                break;
        }
    }

    guildMemberAdd(client, user) {
        // find specific role and add to user
        const guild = client.guilds.cache.get(this.config.guildId);
        const role = guild.roles.cache.find(role => role.id === this.config.roleAssiger.userRole);
        // assign that role to the user
        user.roles.add(role);
    }
}

module.exports = Listener;