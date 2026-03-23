const experss = require('express');
const bodyParser = require('body-parser');
const router = require('./routes/routes');
const cookieParser = require("cookie-parser");
const session = require('express-session');

const app = experss();

const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

const PORT = process.env.PORT || 8000;

// Database models and sync
const { connection, Admin } = require('./models');
connection.sync() // syncs tables
  .then(async () => {
    console.log('Sequelize synchronized database!');
    // Seed default admin if missing
    try {
      await Admin.findOrCreate({
        where: { email: 'admin@admin.com' },
        defaults: { _password: 'admin' }
      });
    } catch(err) {
      console.error('Failed to seed admin', err);
    }
  })
  .catch(err => console.error('Sequelize sync error:', err));


app.use(cookieParser());

app.use(
    session({
        secret: "this is the key",
        resave: false,
        saveUninitialized: true,
        cookie: { path: "/", httpOnly: true, secure: false, maxAge:24* 60 * 60 * 1000}
    })
);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));


app.set('view engine','ejs');
app.use(experss.static('public'));
app.use('/',router);

if (process.env.NODE_ENV !== 'test') {
  server.listen(PORT, err => console.log(`Listening to ${PORT} port`));
}

io.on('connection', (socket) => {
    socket.on('chat message', (msg) => {
      io.emit('chat message', msg);
    });
  });

module.exports = app;