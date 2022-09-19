class Cronjob {
    constructor(config, client) {
        this.cronjobs = {}
    }

    // function that creates a uuid
    uuid() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            var r = Math.random() * 16 | 0,
                v = c == 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }

    add(ms, fn, firstFire = false) {
        const uid = this.uuid();
        const cb = () => {
            clearTimeout(timeout);
            timeout = setTimeout(cb, ms);
            this.cronjobs[uid] = { timeout, ms, fn };
            fn();
        }
        let timeout = setTimeout(cb, ms)
        this.cronjobs[uid] = { timeout, ms, fn };
        if (firstFire) fn();
        return uid;
    }

    stop() {
        for (const uid in this.cronjobs) {
            clearTimeout(this.cronjobs[uid]);
        }
    }

    start(uid) {
        const newuid = this.add(this.cronjobs[uid].ms, this.cronjobs[uid].fn);
        this.cronjobs[uid] = this.cronjobs[newuid];
        this.removeCronjob(uid);
        return newuid;
    }

    removeCronjob(uid) {
        clearTimeout(this.cronjobs[uid]);
        delete this.cronjobs[uid];
    }

    removeAllCronjobs() {
        for (const uid in this.cronjobs) {
            clearTimeout(this.cronjobs[uid]);
            delete this.cronjobs[uid];
        }
    }
}

module.exports = Cronjob;