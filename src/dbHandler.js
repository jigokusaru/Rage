const sqlite3 = require("sqlite3").verbose();

class DbHandler {
  constructor(db) {
    this.openDB(db);
  }
  openDB(db) {
    this.db = new sqlite3.Database(
      db,
      sqlite3.OPEN_CREATE | sqlite3.OPEN_READWRITE,
      (err) => {
        if (err) {
          console.error("Error opening database:", err.message);
        } else {
          console.log("Database opened successfully.");
        }
      }
    );
  }
  closeDB(db) {
    db.close();
  }

  columnValue(discordID,tableName, columnName, newValue = null) {
    const db = this.db
    const selectQuery = `SELECT ${columnName} FROM ${tableName} WHERE discord_ID = ?`;

    if (newValue !== null) {
      // Update the value
      const updateQuery = `UPDATE ${tableName} SET ${columnName} = ? WHERE discord_ID = ?`;
      db.run(updateQuery, [newValue, discordID], (err) => {
        if (err) {
          console.error(`Error updating ${columnName}:`, err.message);
        } else {
          console.log(
            `${columnName} updated for user with discord_ID ${discordID}.`
          );
        }
      });
    } else {
      // Retrieve the value
      db.get(selectQuery, [discordID], (err, row) => {
        if (err) {
          console.error(`Error fetching ${columnName} value:`, err.message);
        } else {
          console.log(
            `User's ${columnName} value: ${row ? row[columnName] : null}`
          );
        }
      });
    }
  }
}

module.exports = { DbHandler };
