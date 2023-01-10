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

server.listen(PORT,err => console.log(`Listening to ${PORT} port`));

io.on('connection', (socket) => {
    socket.on('chat message', (msg) => {
      io.emit('chat message', msg);
    });
  });