const { Game } = require('../models')
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
            Game.create({
                id: id,
                _name: name,
                price: price,
                detail: detail,
                catagory: catagory
            })
            .then(() => {
                notifier.notify(name + ' Added Successfully');
                res.redirect('/viewgames');
            })
            .catch(err => {
                console.log('SQL INSERTION ERROR', err);
                res.send(err.toString());
            });

        }
    });
}

module.exports = {addGameForm,addGame}