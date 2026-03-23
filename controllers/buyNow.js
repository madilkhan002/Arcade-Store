const { Game, Wishlist, Cart, BillReport } = require('../models');
let pdf = require("html-pdf")
let fs = require("fs")
let path = require("path")
const nodemailer = require('nodemailer');
const notify = require('node-notifier');

// add to the wishlist
const addToWishlist = async (req,res)=>{
    const email = req.session.email;

    if(!email || typeof email == 'undefined')
    {
        res.redirect('/signin');
        return;
    }

    const id = parseInt(req.params.id);
    try {
        const item = await Wishlist.findOne({ where: { email, id } });
        if(item) {
            notify.notify("Added to Wishlist");
            res.redirect('/viewgamesuser');
        } else {
            await Wishlist.create({ email, id });
            notify.notify("Added to Wishlist");
            res.redirect('/viewgamesuser');
        }
    } catch(err) {
        res.send('404');
    }
}
//add to the cart
const addToCart = async (req,res)=>{
    const email = req.session.email;
    console.log(email);
    if(!email || typeof email == 'undefined')
    {
        res.redirect('/signin');
        return;
    }
    const id = parseInt(req.params.id);
    try {
        const item = await Cart.findOne({ where: { email, id } });
        if(item) {
            notify.notify("Added to Cart");
            res.redirect('/viewgamesuser');
        } else {
            await Cart.create({ email, id });
            notify.notify("Added to Cart");
            res.redirect('/viewgamesuser');
        }
    } catch (err) {
        res.send('404');
    }
}

//see the wishlist
const wishlist = async (req,res)=>{
    //check the user
    const email = req.session.email;
    if(!email || typeof email == 'undefined')
    {
        res.redirect('/signin');
        return;
    }
    try {
        const items = await Game.findAll({
            include: [{
                model: Wishlist,
                where: { email },
                attributes: []
            }],
            raw: true
        });
        res.render('showWishlist', { data: items });
    } catch (err) {
        res.send('404');
    }
}

//see the cart
const cart = async (req,res)=>{
    //check the user
    const email = req.session.email;
    if(!email || typeof email == 'undefined')
    {
        res.redirect('/signin');
        return;
    }
    try {
        const items = await Game.findAll({
            include: [{
                model: Cart,
                where: { email },
                attributes: []
            }],
            raw: true
        });
        res.render('showCart', { data: items });
    } catch (err) {
        res.send('404');
    }
}

//remove from the cart

const removeCart = async (req,res)=>{
    //check the user
    const email = req.session.email;
    if(!email || typeof email == 'undefined')
    {
        res.redirect('/signin');
        return;
    }
    const id = req.params.id;
    try {
        await Cart.destroy({ where: { email, id } });
        res.redirect('/cart');
    } catch (err) {
        res.send('404');
    }
}

//remove item from the wishlist
const removeWishlist = async (req,res)=>
{
    //check the user
    const email = req.session.email;
    if(!email || typeof email == 'undefined')
    {
        res.redirect('/signin');
        return;
    }
    const id = req.params.id;
    try {
        await Wishlist.destroy({ where: { email, id } });
        res.redirect('/wishlist');
    } catch (err) {
        res.send('404');
    }
}

//buy the game from the cart

const buyCart = (req,res)=>{
    //check the user
    const email = req.session.email;
    if(!email || typeof email == 'undefined')
    {
        res.redirect('/signin');
        return;
    }
    //load the buy game form
    const Id = req.params.id;
    res.render('buyGameForm',{id : Id});
}

const proceedBill = async (req,res)=>{
    const id = req.params.id;   
    const Fname =  req.body.fname;
    const Address = req.body.address;
    const Phone = req.body.phone;
    const City = req.body.city;
    const Province = req.body.province;
    const Quantity = parseInt(req.body.quantity);
    const email = req.session.email;

    try {
        const game = await Game.findOne({ where: { id } });
        if(!game) {
            return res.send('404 ERROR');
        }
        let Total =  parseInt(game.price) * parseInt(req.body.quantity);

        await BillReport.create({
            email, fname: Fname, phone: Phone, quantity: Quantity,
            address: Address, city: City, province: Province, total: Total
        });

        res.render('reportBill',{fname : Fname,address : Address,phone : Phone
            ,city : City,province : Province,quantity : Quantity,price : Total}
            ,function(err1,data)
            {
                var options = {
                    format: 'A4',
                };
                pdf.create(data,options)
                .toFile('report.pdf',(err,result)=>{
                    if(err1)
                    {
                        res.send('403 -> PDF ERROR');
                    }
                    else
                    {
                        let msg = `Name : ${Fname}\nAddress : ${Address}\nPhone : ${Phone}\nQuantity : ${Quantity}\nTotal : ${Total}`;
                        sendMail(email,msg)
                        var report = fs.readFileSync("report.pdf");
                        res.header("content-type", "application/pdf");
                        res.send(report);
                    }
                })
            });
    } catch (err) {
        res.send('404 ERROR');
    }
}

function sendMail(email,msg)
{
    const message = 'Thanks for Shopping\nYour Order Detail : \n' + msg;
    console.log(message);
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
		text: message,
	};
	
	mailTransporter.sendMail(mailDetails, function(err, data) {
		if(err) {
			console.log('Error Occurs');
		} else {
			console.log('Email sent successfully');
		}
	});
}


module.exports = {
    addToWishlist,addToCart,
    wishlist,cart,removeCart,removeWishlist,
    buyCart,proceedBill
};