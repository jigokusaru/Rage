const sqlite3 = require('sqlite3').verbose();

class DbHandler {
    constructor(dbName) {
        this.db = new sqlite3.Database(dbName, (err) => {
            if (err) {
                console.error(err.message);
            }
            console.log('Connected to the database.');
        });
    }

    initializeDb() {
        return new Promise((resolve, reject) => {
            this.db.run(`CREATE TABLE IF NOT EXISTS users (
                id INTEGER PRIMARY KEY,
                discord_id TEXT UNIQUE
            )`, (err) => {
                if (err) {
                    console.error(err.message);
                    reject(err);
                } else {
                    console.log('Table created.');
                    resolve();
                }
            });
        });
    }

    runQuery(query, params) {
        return new Promise((resolve, reject) => {
            this.db.all(query, params, (err, rows) => {
                if (err) {
                    console.error(err.message);
                    reject(err);
                } else {
                    resolve(rows);
                }
            });
        });
    }

    addUser(discord_id) {
        return this.runQuery('SELECT * FROM users WHERE discord_id = ?', [discord_id])
            .then(rows => {
                if (rows.length > 0) {
                    throw new Error();
                } else {
                    return this.runQuery('INSERT INTO users(discord_id) VALUES(?)', [discord_id]);
                }
            });
    }

    closeDb() {
        return new Promise((resolve, reject) => {
            this.db.close((err) => {
                if (err) {
                    console.error(err.message);
                    reject(err);
                } else {
                    console.log('Close the database connection.');
                    resolve();
                }
            });
        });
    }
}

module.exports = {DbHandler};
