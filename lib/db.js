const sqlite3 = require('sqlite3').verbose();
const path = require('path');

let db = null;

function getDatabase() {
  if (!db) {
    const dbPath = path.join(process.cwd(), 'data', 'app.db');
    db = new sqlite3.Database(dbPath);
  }
  return db;
}

function runAsync(sql, params = []) {
  return new Promise((resolve, reject) => {
    getDatabase().run(sql, params, function(err) {
      if (err) reject(err);
      else resolve({ id: this.lastID, changes: this.changes });
    });
  });
}

function getAsync(sql, params = []) {
  return new Promise((resolve, reject) => {
    getDatabase().get(sql, params, (err, row) => {
      if (err) reject(err);
      else resolve(row);
    });
  });
}

function allAsync(sql, params = []) {
  return new Promise((resolve, reject) => {
    getDatabase().all(sql, params, (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });
}

module.exports = {
  runAsync,
  getAsync,
  allAsync,
};
