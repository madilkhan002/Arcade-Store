const { Sequelize } = require('sequelize');

let connection;

if (process.env.NODE_ENV === 'test') {
  connection = new Sequelize('sqlite::memory:', {
    logging: false
  });
} else {
  connection = new Sequelize(
    process.env.DB_NAME || 'testdb1',
    process.env.DB_USER || 'root',
    process.env.DB_PASS || '',
    {
      host: process.env.DB_HOST || '127.0.0.1',
      dialect: 'mysql',
      logging: false, // Set to true to see SQL queries in console
    }
  );
}

connection.authenticate()
  .then(() => {
    console.log('Database Connected via Sequelize!');
  })
  .catch((err) => {
    console.log('Database Connection Failed!');
    console.error(err);
  });

module.exports = connection;