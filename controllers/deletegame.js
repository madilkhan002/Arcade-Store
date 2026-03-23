const express = require('express');
const path = require('path');
const fs = require('fs');
const { Game } = require('../models');
const { Op } = require('sequelize');
const app = express();

const gamesPerPage = 3;

const homePage = async (req,res)=>{
    //getting data about the filter & search
    try {
        const totalGames = await Game.count();
        const games = await Game.findAll({ limit: 3, offset: 0, raw: true });
        showData(games,res,req,0,totalGames,1,"null");
    } catch (err) {
        res.send('404 Error');
    }
}

const delete_pager = async (req,res)=>{
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

const deleteGames_catagory_page = async (req,res)=>{
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

//search
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
    } catch (err) {
        res.send('404 Error');
    }
}


//function to show the data
function showData(result,res,req,search,totalGames,page,Catagory)
{
    res.render('deletegame',{data : result,isSearch : search,totalPages : Math.ceil(totalGames/gamesPerPage),currPage : page,catagory:Catagory.toString()});
}


//Delete from the database
const deleteGame = async (req,res)=>{
    const id = req.params.id;
    try {
        const deleted = await Game.destroy({ where: { id } });
        console.log("Number of records Deleted: " + deleted);
        const PATH = path.resolve('public/images/') +"/"+ id.toString()+ '.jpeg';
        if(fs.existsSync(PATH)) {
            fs.unlinkSync(PATH);
        }
        res.redirect('/deletegame');
    } catch (err) {
        console.log('ERROR AT DELETION OF GAME');
        res.send('404 ERROR');
    }
}

module.exports = {homePage,delete_pager,deleteGames_catagory_page,deleteGame,searchGame};

