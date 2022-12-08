const express = require('express');
const nodemailer = require('nodemailer');
const connection = require("../config/sqlConnection");

const app = express();
//rendering the signup page
const signup = (req,res)=>{
    res.render('signup');
}


//pin validation function
const pinValidation = (req,res)=>{
    const name = req.body.name;
    const email = req.body.email;
    const password = req.body.password;

    //check if user already exits or not
    const Query =  `select * from users where email = '${email}'`;
    connection.query(Query,(err,result)=>
    {
        if(result && result.length)
        {   
            return res.send('<h1>USER ALREADY EXISTS</h1>');
        }else
        {
            //record not exists
            const data = {name : name,email : email,password : password};    
            const pin = Math.floor(1000 + Math.random() * 9000);
            console.log(pin);
            sendMail(email,pin.toString());
            req.session.data = data;
            req.session.pin = pin;
            res.render('confirmPin');
        }
    })
}

const dashboard = (req,res) => {
    res.render("home");
}

//confirm the pin and add new user
const addUser = (req,res)=>
{
    const Data  = req.session.data
    const pin  = req.session.pin
    const userPin = req.body.pin;
    //clearing the session data
    req.session.data = null;
    req.session.pin = null;
    //verify the pin
    if(pin ==  userPin)
    {
        const Query = `INSERT INTO users VALUES('${Data.email}','${Data.name}','${Data.password}')`;
        connection.query(Query,(err,result)=>{
            if(err)
            {
                console.log('SQL INSERTION ERROR');
                // console.log(err);
                res.send('404 ERROR')
            }else
            {
                res.redirect('/signin');
            }
        })
    }else
    {
        res.send('<h1>PIN NOT MATCHED</h1>');
    }
}




//nodemailer to send pin to the mail
function sendMail(email,msg)
{
    const message = 'Thanks for SignUp, Your Verification Pin : ' + msg;
	let mailTransporter = nodemailer.createTransport({
		service: 'gmail',
		auth: {
			user: 'webarcadestore@gmail.com',
			pass: 'tcroykzxkfvwqlge'
		}
	});
	
	let mailDetails = {
		from: 'webarcadestore@gmail.com',
		to: email,
		subject: 'Web Arcade Store',
		text: message
	};
	
	mailTransporter.sendMail(mailDetails, function(err, data) {
		if(err) {
			console.log('Error Occurs');
		} else {
			console.log('Email sent successfully');
		}
	});
}

//signin as a user

const signin = (req,res)=>{
    res.render('signin')
}

const adminHome = (req,res)=>{
    res.render('adminPanel')
}


//authenticate the data when user sign in 
const authenticateSignin = (req,res)=>{
    const email = req.body.email;
    const password =  req.body.pass;
    const role = req.body.role.toString();
    //identify the role
    if(role == 'admin')
    {
        //match the data with the admin
        const Query = `SELECT * FROM admins where email='${email}' AND _password='${password}'`;
        connection.query(Query,(err,result)=>{
            if(result && result.length)
            {
                req.session.role = role;
                req.session.email = email;
                res.redirect('/adminPanel');
            }else
            {
                res.redirect('/signin');
            }
            
        })
    }
    else
    {
        //match the data with the users table in DB
        const Query = `SELECT * FROM users where email='${email}' AND _password='${password}'`;
        connection.query(Query,(err,result)=>{
            if(result && result.length)
            {
                req.session.role = role;
                req.session.email = email;
                res.redirect('/home');
            }else
            {
                res.redirect('/signin');
            }
        })
    }
}



module.exports = {
    signup,
    pinValidation,
    addUser,
    signin,
    authenticateSignin,
    dashboard,
    adminHome
}