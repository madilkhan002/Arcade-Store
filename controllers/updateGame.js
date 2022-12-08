const express = require('express');
const path = require('path');
const connection = require('../config/sqlConnection');
const multer = require('multer');

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

const update_pager = (req,res)=>{
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

const update_pager_catagory_page = (req,res)=>{
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

//function to show the data
function showData(result,res,req,search,totalGames,page,Catagory)
{
    res.render('updateGame',{data : result,isSearch : search,totalPages : Math.ceil(totalGames/gamesPerPage),currPage : page,catagory:Catagory.toString()});
}

//update game form
const updateGameForm = (req,res)=>{
    const id =  req.params.id;
    const Query = `select * from games where id = '${id}'`;
    connection.query(Query,(err,result)=>{
        if(err)
        {
            res.send(err.toString());
        }else
        {
            res.render('updateGameForm',{data:result});
        }
    })
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

    upload(req,res,(err)=>{
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

            const Query = `UPDATE games set _name = '${name}', price = '${price}' , detail = '${detail}' , catagory = '${catagory}' where id = ${id}`;
            connection.query(Query,(err,result)=>{
                if(err)
                {
                    console.log('SQL ERROR WHILE UPDATION');
                    res.send('404 ERROR');
                }
                else
                {
                    console.log('GAME UPDATED SUCCESSFULLY');
                    res.redirect('/updategame');
                }
            })
        }

    })

}

//seach game
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


module.exports = {homePage,update_pager,update_pager_catagory_page,updateGameForm,updateGame,searchGame};