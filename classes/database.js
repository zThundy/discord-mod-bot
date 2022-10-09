const sqlite = require('sqlite3');

class SQL {
    constructor(config, client) {
        this.config = config;
        this.db = null;
        this._init();
        console.log("> Database loaded");
    }

    _init() {
        this.db = new sqlite.Database(`./data/${this.config.database.filename}.db`);
        this.db.run("CREATE TABLE IF NOT EXISTS reactions (guildId TEXT, channelId TEXT, messageId TEXT, reactions TEXT)");
        this.db.run("CREATE TABLE IF NOT EXISTS minecraft (guildId TEXT, userId TEXT, minecraftName TEXT)");
        // this.db.run("CREATE TABLE IF NOT EXISTS nicks (guildId TEXT, userId TEXT, nick TEXT)");
    }

    getReactions() {
        return new Promise((resolve, reject) => {
            this.db.all("SELECT * FROM reactions", (err, rows) => {
                if (err) resolve([]);
                resolve(rows);
            });
        });
    }

    addReaction(data) {
        /**
         * @param {STRING} data.reactions
         * @param {STRING} data.guildId
         * @param {STRING} data.channelId
         * @param {STRING} data.messageId
         */
        this.db.run(`INSERT INTO reactions (guildId, channelId, messageId, reactions) VALUES (?, ?, ?, ?)`, [data.guildId, data.channelId, data.messageId, data.reactions]);
    }

    removeReaction(data) {
        /**
         * @param {STRING} data.guildId
         * @param {STRING} data.channelId
         * @param {STRING} data.messageId
         */
        this.db.run(`DELETE FROM reactions WHERE guildId = ? AND channelId = ? AND messageId = ?`, [data.guildId, data.channelId, data.messageId]);
    }

    addMinecraftUser(data) {
        /**
         * @param {STRING} data.guildId
         * @param {STRING} data.userId
         * @param {STRING} data.minecraftName
         */
        this.db.run(`INSERT INTO minecraft (guildId, userId, minecraftName) VALUES (?, ?, ?)`, [data.guildId, data.userId, data.minecraftName]);
    }

    removeMinecraftUser(data) {
        /**
         * @param {STRING} data.guildId
         * @param {STRING} data.userId
         */
        this.db.run(`DELETE FROM minecraft WHERE guildId = ? AND userId = ?`, [data.guildId, data.userId]);
    }

    getMinecraftUser(data) {
        /**
         * @param {STRING} data.guildId
         * @param {STRING} data.userId
         */
        return new Promise((resolve, reject) => {
            this.db.get(`SELECT * FROM minecraft WHERE guildId = ? AND userId = ?`, [data.guildId, data.userId], (err, row) => {
                if (err) resolve(null);
                resolve(row);
            });
        });
    }
}

module.exports = SQL;