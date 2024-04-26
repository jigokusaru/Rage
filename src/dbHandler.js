const sqlite3 = require('sqlite3').verbose();

// Connect to the SQLite database (or create a new one if it doesn't exist)
// Create or open the SQLite database
const db = new sqlite3.Database('./src/util/discord_data.db', sqlite3.OPEN_CREATE | sqlite3.OPEN_READWRITE, err => {
  if (err) {
    console.error('Error opening database:', err.message);
  } else {
    console.log('Database opened successfully.');
  }
});

// Define the initial table schema (with primary ID and discord_ID)
const initialSchema = `
    CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY,
        discord_ID TEXT
    );
`;

// Execute the initial schema
db.run(initialSchema, (err) => {
    if (err) {
        console.error('Error creating initial table:', err.message);
    } else {
        console.log('Initial table created successfully.');
    }
});

// Function to add a new column to the table
function addColumn(tableName, columnName, columnType) {
    const alterQuery = `ALTER TABLE ${tableName} ADD COLUMN ${columnName} ${columnType};`;
    db.run(alterQuery, (err) => {
        if (err) {
            console.error(`Error adding column ${columnName}:`, err.message);
        } else {
            console.log(`Column ${columnName} added successfully.`);
        }
    });
}

function addUser(discordID) {
  const insertQuery = `INSERT INTO users (discord_ID) VALUES (?)`;
  db.run(insertQuery, [discordID], (err) => {
      if (err) {
          console.error('Error adding user:', err.message);
      } else {
          console.log(`User with discord_ID ${discordID} added successfully.`);
      }
  });
}



// Example: Remove columns from the table
/*db.serialize(() => {
    db.run('PRAGMA foreign_keys=off;');
    db.run('BEGIN TRANSACTION;');
    db.run('CREATE TABLE users_new (id INTEGER PRIMARY KEY, discord_ID TEXT);'); //Add other columns
    db.run('INSERT INTO users_new SELECT id, discord_ID FROM users;');
    db.run('DROP TABLE users;');
    db.run('ALTER TABLE users_new RENAME TO users;');
    db.run('COMMIT;');
    db.run('PRAGMA foreign_keys=on;');
});*/

// Close the database connection
db.close();