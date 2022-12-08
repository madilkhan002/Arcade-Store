const mysql = require("mysql");

const connection = mysql.createConnection({
    // host:'sql6.freemysqlhosting.net',
    // user:'sql6583283',
    // password:'gTGQA5gwAV',
    // database:'sql6583283',
    // port: "3306"
    host:'127.0.0.1',
    user:'root',
    password:'System@6363',
    database:'testdb1'
});

connection.connect((err)=>{
    if(err)
    {
        console.log("Database Connection Failed!");
        console.log(err);
    }
    else
    {
        console.log("Database Connected!");
    }
});

module.exports = connection;