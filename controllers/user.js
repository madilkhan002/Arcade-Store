const express = require('express');
const nodemailer = require('nodemailer');
const { User, Admin } = require("../models");

const app = express();
//rendering the signup page
const signup = (req,res)=>{
    res.render('signup');
}


//pin validation function
const pinValidation = async (req,res)=>{
    const name = req.body.name;
    const email = req.body.email;
    const password = req.body.password;

    try {
        const user = await User.findOne({ where: { email } });
        if(user) {
            return res.send('<h1>USER ALREADY EXISTS</h1>');
        } else {
            const data = {name : name,email : email,password : password};    
            const pin = Math.floor(1000 + Math.random() * 9000);
            console.log(pin);
            sendMail(email,pin.toString());
            req.session.data = data;
            req.session.pin = pin;
            res.render('confirmPin');
        }
    } catch (err) {
        res.send('404 Error');
    }
}

const dashboard = (req,res) => {
    res.render("home");
}

//confirm the pin and add new user
const addUser = async (req,res)=>
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
        try {
            await User.create({
                email: Data.email,
                name: Data.name,
                _password: Data.password
            });
            res.redirect('/signin');
        } catch(err) {
            console.log('SQL INSERTION ERROR', err);
            res.send('404 ERROR');
        }
    }else
    {
        res.send('<h1>PIN NOT MATCHED</h1>');
    }
}




//nodemailer to send pin to the mail
function sendMail(email,msg)
{
    const message = 'Dear very nic customer,Your Verification Pin : ' + msg;
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
const authenticateSignin = async (req,res)=>{
    const email = req.body.email;
    const password =  req.body.pass;
    const role = req.body.role.toString();

    try {
        if(role == 'admin')
        {
            const admin = await Admin.findOne({ where: { email, _password: password } });
            if(admin) {
                req.session.role = role;
                req.session.email = email;
                res.redirect('/adminPanel');
            } else {
                res.redirect('/signin');
            }
        }
        else
        {
            const user = await User.findOne({ where: { email, _password: password } });
            if(user) {
                req.session.role = role;
                req.session.email = email;
                res.redirect('/home');
            } else {
                res.redirect('/signin');
            }
        }
    } catch(err) {
        res.redirect('/signin');
    }
}
//forget pass
const forgetPassForm = (req,res)=>{
    res.render('forgetPassForm');
}
const forgetPassPin = async (req,res)=>{
    const email = req.body.email;
    try {
        const user = await User.findOne({ where: { email } });
        if(user){
            const pin = Math.floor(1000 + Math.random() * 9000);
            console.log(pin);
            req.session.fp_pin = pin;
            req.session.fp_email = email;
            sendMail(email,pin.toString());
            res.render('confirmPin_FP');
        }else{
            res.redirect('/signin');
        }
    } catch(err) {
        res.redirect('/signin');
    }
}

const forgetPassPinValidate = (req,res)=>{
    const pin = req.body.pin;
    if(!req.session.fp_pin || req.session.fp_pin!=pin){
        res.redirect('/signin');
    }else{
        res.render('newPassword');
    }
}

const setNewPassword = async (req,res)=>{
    const newPass = req.body.pass;
    const email = req.session.fp_email;
    try {
        await User.update({ _password: newPass }, { where: { email } });
        res.redirect('/signin');
    } catch(err) {
        res.send('404');
    }
}

module.exports = {
    signup,
    pinValidation,
    addUser,
    signin,
    authenticateSignin,
    dashboard,
    adminHome,forgetPassForm,forgetPassPin,forgetPassPinValidate,setNewPassword
}