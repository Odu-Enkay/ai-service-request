const db = require('./index');

async function testConnection() {
  try {
    const result = await db.query('SELECT NOW()');
    console.log('Query worked:', result.rows[0]);
  } catch (err) {
    console.error('Query failed:', err);
  }
}

testConnection();