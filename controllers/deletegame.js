const express = require('express');
const path = require('path');
const fs = require('fs');
const connection = require('../config/sqlConnection');
const app = express();

const gamesPerPage = 3;

const homePage = (req,res)=>{
    //getting data about the filter & search
    let totalGames = 0;
    connection.query('select count(*) as COUNT from games',(err,data)=>{
        if(err) res.send('404 Error');
        totalGames = data[0].COUNT;
    })

    const Query =  `select * from games LIMIT 0,3`;
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

const delete_pager = (req,res)=>{
    //getting data about the filter & search

    //get the total games
    let totalGames = 0;
    connection.query('select count(*) as COUNT from games',(err,data)=>{
        if(err) res.send('404 Error');
        totalGames = data[0].COUNT;
    })
    const currPage = parseInt(req.params.page);
    const page = parseInt(req.params.page - 1) * 3;
    const Query =  `select * from games LIMIT ${page},3`;
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

const deleteGames_catagory_page = (req,res)=>{
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


    const Query =  `select * from games where catagory = '${catagory}' LIMIT ${page},${3}`;
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

//search
const searchGame = (req,res)=>{
    const search = req.body.search;

    const Query =  `select * from games where _name LIKE '%${search}%'`;
    connection.query(Query,(err,result)=>{
        if(err)
        {
            res.send('404 Error');
        }
        else
        {
            showData(result,res,req,1,0,0,0,"null");
        }
    })
}


//function to show the data
function showData(result,res,req,search,totalGames,page,Catagory)
{
    res.render('deletegame',{data : result,isSearch : search,totalPages : Math.ceil(totalGames/gamesPerPage),currPage : page,catagory:Catagory.toString()});
}


//Delete from the database
const deleteGame = (req,res)=>{
    const id = req.params.id;
    const Query =  `delete from games where id = '${id}'`;
    connection.query(Query,(err,result)=>{
        if(err)
        {
            console.log('ERROR AT DELETION OF GAME');
            res.send('404 ERROR');
        }
        else
        {
            console.log("Number of records Deleted: " + result.affectedRows);
            const PATH = path.resolve('public/images/') +"/"+ id.toString()+ '.jpeg';
            fs.unlinkSync(PATH);
            res.redirect('/deletegame')
        }
    })
}

module.exports = {homePage,delete_pager,deleteGames_catagory_page,deleteGame,searchGame};

