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

  
}

module.exports = { DbHandler };
