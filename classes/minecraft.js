const { RconConnection } = require("@scriptserver/core");

class MinecraftHandler {
    constructor(config, client) {
        this.config = config;
        this.db = client.db;
        this.connection = new RconConnection({
            rconConnection: {
                host: this.config.minecraft.host,
                port: this.config.minecraft.port,
                password: this.config.minecraft.password
            }
        });

        this._createHandlers();
        this.connection.connect();
    }

    _createHandlers() {
        console.log("Creating handlers for RCON connection");

        this.connection.on("connect", () => {
            console.log("Connected to Minecraft server");
        });

        this.connection.on("disconnect", () => {
            console.log("Disconnected from Minecraft server");
        });
    }

    async sendCommand(command) {
        return await this.connection.send(command);
    }

    addPlayer(data) {
        this.connection.connect();
        this.db.getMinecraftUser({ userId: data.userId, guildId: data.guildId }).then((user) => {
            if (user) this.db.removeMinecraftUser({ userId: data.userId, guildId: data.guildId });
            this.db.addMinecraftUser(data);
            this.sendCommand(`whitelist add ${data.minecraftName}`);
        });
    }

    removePlayer(data) {
        this.connection.connect();
        this.db.getMinecraftUser({ userId: data.userId, guildId: data.guildId }).then((user) => {
            this.db.removeMinecraftUser({ userId: data.userId, guildId: data.guildId });
            if (!user) return;
            this.sendCommand(`whitelist remove ${user.minecraftName}`);
        });
    }
}

module.exports = MinecraftHandler;