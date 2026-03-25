const express = require('express');
const { Game, Comment } = require('../models');
const { Op } = require('sequelize');
const app = express();
const path = require ('path');
const XMLHttpRequest = require('xhr2');


const gamesPerPage = 6;

const homePage = async (req,res)=>{
    try {
        const totalGames = await Game.count();
        const games = await Game.findAll({ limit: 6, offset: 0, raw: true });
        showData(games,res,req,0,totalGames,1,"null");
    } catch(err) {
        res.send('404 Error');
    }
}

const viewGames_pager = async (req,res)=>{
    try {
        const totalGames = await Game.count();
        const currPage = parseInt(req.params.page);
        const offset = (currPage - 1) * 6;
        const games = await Game.findAll({ limit: 6, offset: offset, raw: true });
        showData(games,res,req,0,totalGames,currPage,"null");
    } catch(err) {
        res.send('404 Error');
    }
}

const viewGviewGames_catagory_page = async (req,res)=>{
    const currPage = parseInt(req.params.page);
    const offset = (currPage - 1) * 3;
    const catagory = req.params.catagory;

    try {
        const totalGames = await Game.count({ where: { catagory } });
        const games = await Game.findAll({ where: { catagory }, limit: 6, offset: offset, raw: true });
        showData(games,res,req,0,totalGames,currPage,catagory);
    } catch(err) {
        res.send('404 Error');
    }
}

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

const details = async (req,res) =>{
    const id = parseInt(req.params.id);
    try {
        const game = await Game.findAll({ where: { id }, raw: true });
        if(!game || game.length === 0) {
            return res.send ('error from 400 to 500');
        }
        const comments = await Comment.findAll({ where: { gameid: id }, raw: true });

        const url = "https://store.steampowered.com/api/appdetails?appids="+id;
        var xhr = new XMLHttpRequest();
        xhr.open("GET", url);

        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4) {
                xhr.responseText = xhr.responseText.replace(/<\/?([a-z][a-z0-9]*)\b[^>]*>/gi, '');
                const gameData = JSON.parse(xhr.responseText);
                const steamData = gameData[`${id}`];
                res.render('usergamedetails', {data: game, steam: steamData, com: comments});
            }
        };
        xhr.send();
    } catch(err) {
        res.send('error from 400 to 500');
    }
}


const comment = async (req,res) => {
    const gid = req.params.id;
    const com = req.body.comment;

    try {
        await Comment.create({
            gameid: gid,
            comm: com
        });
        res.redirect(`/usergamedetails/${gid}`);
    } catch(err) {
        res.send(err);
    }
}


//function to show the data
function showData(result,res,req,search,totalGames,page,Catagory)
{
    res.render('viewgamesuser',{data : result,
        isSearch : search,
        totalPages : Math.ceil(totalGames/gamesPerPage),
        currPage : page,
        catagory:Catagory.toString()
    });
}
const rating= async (req,res)=>{

     const rate=parseInt(req.body.rate);
     console.log('value of rate',rate);
     const id = parseInt(req.params.id);

     try {
         const game = await Game.findOne({ where: { id } });
         if(!game) return res.send('404 ERROR');

         const currentStars = game.stars || 0;
         const currentTotal = game.total || 0;

         await Game.update({
             stars: currentStars + rate,
             total: currentTotal + 1
         }, { where: { id } });

         res.redirect('/viewgamesuser');
     } catch (err) {
         console.log('SQL ERROR WHILE UPDATION');
         res.send('404 ERROR');
     }
}
module.exports = {comment, homePage,viewGames_pager,viewGviewGames_catagory_page,searchGame,details,rating};

