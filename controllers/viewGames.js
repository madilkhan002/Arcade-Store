const express = require('express');
const connection = require('../config/sqlConnection');
const app = express();
const path = require ('path');
const { parse } = require('path');
const XMLHttpRequest = require('xhr2');
const { json } = require('body-parser');
const { isTypedArray, isKeyObject } = require('util/types');

const gamesPerPage = 6;

const homePage = (req,res)=>{
    let totalGames = 0;
    connection.query('select count(*) as COUNT from games',(err,data)=>{
        if(err) res.send('404 Error');
        totalGames = data[0].COUNT;
    })

    const Query =  `select * from games LIMIT 0 , 6`;
    connection.query(Query,(err,result)=>{
        if(err)
        {
            res.send('404 Error');
        }else
        {
            showData(result,res,req,0,totalGames,1,"null");
        }
    })
}

const viewGames_pager = (req,res)=>{
    //getting data about the filter & search

    //get the total games
    let totalGames = 0;
    connection.query('select count(*) as COUNT from games',(err,data)=>{
        if(err) res.send('404 Error');
        totalGames = data[0].COUNT;
    })
    const currPage = parseInt(req.params.page);
    const page = parseInt(req.params.page - 1) * 6;
    const Query =  `select * from games LIMIT ${page}, 6`;
    connection.query(Query,(err,result)=>{
        if(err)
        {
            res.send('404 Error');
        }else
        {
            showData(result,res,req,0,totalGames,currPage,"null");
        }
    })    
}

const viewGviewGames_catagory_page = (req,res)=>{
    //getting data about the filter & search
    //get the total games
    let totalGames = 0;
    const currPage = parseInt(req.params.page);
    const page = parseInt(req.params.page - 1) * 3;
    const catagory = req.params.catagory;

    connection.query(`select count(*) as COUNT from games where catagory = '${catagory}'`,(err,data)=>{
        if(err) res.send('404 Error');
        totalGames = data[0].COUNT;
    })


    const Query =  `select * from games where catagory = '${catagory}' LIMIT ${page},${6}`;
    connection.query(Query,(err,result)=>{
        if(err)
        {
            res.send('404 Error');
        }else
        {
            showData(result,res,req,0,totalGames,currPage,catagory);
        }
    })
}

const searchGame = (req,res)=>{
    const search = req.body.search;
    const Query =  `select * from games where _name LIKE '%${search}%'`;
    connection.query(Query,(err,result)=>{
        if(err)
        {
            res.send('404 Error');
        }else
        {
            showData(result,res,req,1,0,0,0,"null");
        }
    })
}

const details = (req,res) =>{
    const id = parseInt(req.params.id);
    const query = `Select * from games where id = ${id}`;
    connection.query(query, (err,result)=>{
        if (err){
            res.send ('error from 400 to 500');
        }
        else {
            const id = req.params.id;
            const url = "https://store.steampowered.com/api/appdetails?appids="+id;
            var xhr = new XMLHttpRequest();
            xhr.open("GET", url);

            xhr.onreadystatechange = function () {
                if (xhr.readyState === 4) {
                const id2 = req.params.id;
                xhr.responseText = xhr.responseText.replace(/<\/?([a-z][a-z0-9]*)\b[^>]*>/gi, '');
                const gameData = JSON.parse(xhr.responseText);
                // console.log(gameData);
                // res.send(gameData[`${id}`]["data"]);
                const steamData = gameData[`${id}`];
                // res.send(steamData["data"]["reviews"])
                res.render('gameDetails', {data: result, steam: steamData});
                }
            };
            xhr.send();
        }
    })
}

const comment = (req,res) => {
    const gid = req.params.id;
    const com = req.body.comment;

    let totalcomms = 1;
    connection.query('select count(*) as COUNT from comments',(err,data)=>{
        if(err) res.send('404 Error');
        totalcomms = data[0].COUNT;
    })

    const q = `insert into comments values (${totalcomms}, '${gid}',' ${com}')`;
    connection.query(q,(err,result) => {
        if (err){
            res.send(err);
        }
        else{
            res.send('comment inserted');
        }
    })
}

//function to show the data
function showData(result,res,req,search,totalGames,page,Catagory)
{
    res.render('viewgames',{data : result,
        isSearch : search,
        totalPages : Math.ceil(totalGames/gamesPerPage),
        currPage : page,
        catagory:Catagory.toString()
    });
}

module.exports = {homePage,viewGames_pager,viewGviewGames_catagory_page,searchGame,details,comment};

