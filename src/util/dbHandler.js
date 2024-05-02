const mariadb = require("mariadb");

class DbHandler {
  constructor(dbName) {
    this.pool = mariadb.createPool({
      host: "localhost",
      user: "RagingRedGyarados",
      password: "RageIsGreat2024!",
      database: dbName,
      connectionLimit: 5,
    });
  }

  async initializeDb() {
    let conn;
    try {
      conn = await this.pool.getConnection();
      // Create the users table if it does not exist
      await conn.query(`CREATE TABLE IF NOT EXISTS users (
                id INT PRIMARY KEY AUTO_INCREMENT,
                discord_id VARCHAR(255) UNIQUE
            )`);
      console.log("Users table checked/created.");

      // Define the desired columns
      const desiredColumns = {
        exp: "INT default 0",
      };

      // Get the current columns in the table
      let rows = await conn.query(`SHOW COLUMNS FROM users`);
      let currentColumns = rows.map((row) => row.Field);

      // Add the desired columns if they do not exist
      for (let column in desiredColumns) {
        if (!currentColumns.includes(column)) {
          await conn.query(
            `ALTER TABLE users ADD COLUMN ${column} ${desiredColumns[column]}`
          );
          console.log(`${column} column added.`);
        }
      }

      // Remove the extra columns if they exist
      for (let column of currentColumns) {
        if (
          !Object.keys(desiredColumns).includes(column) &&
          column !== "id" &&
          column !== "discord_id"
        ) {
          await conn.query(`ALTER TABLE users DROP COLUMN ${column}`);
          console.log(`${column} column removed.`);
        }
      }
    } catch (err) {
      console.error(err.message);
    } finally {
      if (conn) conn.release(); //release to pool
    }
  }

  async runQuery(query, params) {
    let conn;
    try {
      conn = await this.pool.getConnection();
      let rows = await conn.query(query, params);
      return rows;
    } catch (err) {
      console.error(err.message);
    } finally {
      if (conn) conn.release();
    }
  }

  async addUser(discord_id) {
    let rows = await this.runQuery("SELECT * FROM users WHERE discord_id = ?", [
      discord_id,
    ]);
    if (rows.length > 0) {
      throw new Error();
    } else {
      return this.runQuery("INSERT INTO users(discord_id) VALUES(?)", [
        discord_id,
      ]);
    }
  }
  async getId(discord_id) {
    let rows = await this.runQuery(
      "SELECT id FROM users WHERE discord_id = ?",
      [discord_id]
    );
    if (rows.length > 0) {
      return rows[0].id;
    } else {
      throw new Error("User not found");
    }
  }

  closeDb() {
    this.pool.end();
    console.log("Close the database connection.");
  }
}

module.exports = { DbHandler };
