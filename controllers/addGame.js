const connection = require('../config/sqlConnection')
const multer = require('multer');
const path = require('path');
const notifier = require('node-notifier');
// import {initNotifications, notify} from 'browser-notification'

//setup multer to add images

const storage = multer.diskStorage({
    destination : './public/images',
    filename : (req,file,callback)=>{
        let id = req.body.id;
            callback(null,id.toString() + path.extname(file.originalname));
    }
});

// Initialize uploader
const upload = multer({
    storage : storage,
}).single('picture')


// Other
const addGameForm = (req,res)=>{
    res.render('addGameForm')
}

const addGame = (req,res)=>{
    upload(req,res,(err)=>{
        if(err)
        {
            res.send(err.toString());
        }else
        {
            const id = req.body.id;
            const name = req.body.name;
            const price = req.body.price;
            const detail = req.body.detail;
            const catagory = req.body.catagory;

            if (price >= 'a' && price <='z' || price >='A' && price <='Z') {
                notifier.notify('Invalid Price Entered');
                res.redirect('/addgameform');
                return;
            }
            //getting the id of next game
            // query to get last product id
            const Query1 = 'SELECT id FROM games ORDER BY id DESC LIMIT 1'
            connection.query(Query1,(err,result)=>{
                if(result.length)
                {
                    const Query = `INSERT INTO games(id,_name,price,detail,catagory) VALUES(${id},"${name}","${price}","${detail}","${catagory}")`;
                    connection.query(Query,(err,result)=>
                    {
                        if(err)
                        {
                            console.log('SQL INSERTION ERROR1');
                            res.send(err.toString());
                        }else
                        {
                            notifier.notify(name + ' Added Successfully');
                            res.redirect('/viewgames');
                        }
                    })
                }
                else
                {
                    const Query = `INSERT INTO games VALUES(${id},'${name}','${price}','${detail}','${catagory}')`;
                    connection.query(Query, (err,result)=>
                    {
                        if(err)
                        {
                            console.log('SQL INSERTION ERROR2');
                            res.send(err.toString());
                        }else
                        {
                            notifier.notify(name + ' Added Successfully');
                            res.redirect('/viewgames');
                        }
                    })
                }
            })

        }
    });
}

module.exports = {addGameForm,addGame}