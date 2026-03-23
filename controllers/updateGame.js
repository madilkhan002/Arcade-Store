const express = require('express');
const path = require('path');
const { Game } = require('../models');
const { Op } = require('sequelize');
const multer = require('multer');

const gamesPerPage = 3;

const homePage = async (req,res)=>{
    try {
        const totalGames = await Game.count();
        const games = await Game.findAll({ limit: 3, offset: 0, raw: true });
        showData(games,res,req,0,totalGames,1,"null");
    } catch (err) {
        res.send('404 Error');
    }
}

const update_pager = async (req,res)=>{
    try {
        const totalGames = await Game.count();
        const currPage = parseInt(req.params.page);
        const offset = (currPage - 1) * 3;
        const games = await Game.findAll({ limit: 3, offset: offset, raw: true });
        showData(games,res,req,0,totalGames,currPage,"null");
    } catch (err) {
        res.send('404 Error');
    }
}

const update_pager_catagory_page = async (req,res)=>{
    const currPage = parseInt(req.params.page);
    const offset = (currPage - 1) * 3;
    const catagory = req.params.catagory;

    try {
        const totalGames = await Game.count({ where: { catagory } });
        const games = await Game.findAll({ where: { catagory }, limit: 3, offset: offset, raw: true });
        showData(games,res,req,0,totalGames,currPage,catagory);
    } catch (err) {
        res.send('404 Error');
    }
}

//function to show the data
function showData(result,res,req,search,totalGames,page,Catagory)
{
    res.render('updateGame',{data : result,isSearch : search,totalPages : Math.ceil(totalGames/gamesPerPage),currPage : page,catagory:Catagory.toString()});
}

//update game form
const updateGameForm = async (req,res)=>{
    const id =  req.params.id;
    try {
        const game = await Game.findAll({ where: { id }, raw: true });
        res.render('updateGameForm',{data:game});
    } catch(err) {
        res.send(err.toString());
    }
}


//setup multer to add images
const storage = multer.diskStorage({
    destination : './public/images',
    filename : (req,file,callback)=>{
        let id = req.params.id.toString();
        callback(null,id + path.extname(file.originalname));
    }
});

// Initialize uploader
const upload = multer({
    storage : storage,
}).single('picture')


//update game in the database
const updateGame = (req,res)=>{

    upload(req,res,async (err)=>{
        if(err)
        {
            res.send(err.toString());
        }
        else
        {
            const id = parseInt(req.params.id);
            const name = req.body.name;
            const price = req.body.price;
            const detail = req.body.detail;
            const catagory = req.body.catagory;

            try {
                await Game.update({
                    _name: name,
                    price: price,
                    detail: detail,
                    catagory: catagory
                }, { where: { id } });
                console.log('GAME UPDATED SUCCESSFULLY');
                res.redirect('/updategame');
            } catch(error) {
                console.log('SQL ERROR WHILE UPDATION');
                res.send('404 ERROR');
            }
        }

    })

}

//seach game
const searchGame = async (req,res)=>{
    const search = req.body.search;
    try {
        const games = await Game.findAll({
            where: {
                _name: {
                    [Op.like]: `%${search}%`
                }
            },
            raw: true
        });
        showData(games,res,req,1,0,0,0,"null");
    } catch(err) {
        res.send('404 Error');
    }
}


module.exports = {homePage,update_pager,update_pager_catagory_page,updateGameForm,updateGame,searchGame};