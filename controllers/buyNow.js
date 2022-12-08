const connection = require('../config/sqlConnection')
let pdf = require("html-pdf")
let fs = require("fs")
let path = require("path")
const nodemailer = require('nodemailer');
const notify = require('node-notifier');

// add to the wishlist
const addToWishlist = (req,res)=>{
    const email = req.session.email;

    if(!email || typeof email == 'undefined')
    {
        res.redirect('/signin');
        return;
    }

    const id = parseInt(req.params.id);
    let Query = `select * from wishlist where email = '${email}' AND id = ${id}`
    connection.query(Query,(err,result)=>{
        if(result && result.length)
        {
            notify.notify("Added to Wishlist");
            res.redirect('/viewgamesuser');
        }
        else
        {
            Query = `INSERT INTO wishlist VALUES('${email}',${id})`;
            connection.query(Query,(err,result)=>{
                if(err)
                {
                    res.send('404')
                }else
                {
                    notify.notify("Added to Wishlist");
                    res.redirect('/viewgamesuser');
                }
            })
        }
    })
}
//add to the cart
const addToCart = (req,res)=>{
    const email = req.session.email;
    console.log(email);
    if(!email || typeof email == 'undefined')
    {
        res.redirect('/signin');
        return;
    }
    const id = parseInt(req.params.id);
    let Query = `select * from cart where email = '${email}' AND id = ${id}`
    connection.query(Query,(err,result)=>{
        if(result && result.length)
        {
            notify.notify("Added to Cart");
            res.redirect('/viewgamesuser');
        }
        else
        {
            Query = `INSERT INTO cart VALUES('${email}',${id})`;
            connection.query(Query,(err,result)=>{
                if(err)
                {
                    res.send('404')
                }else
                {
                    notify.notify("Added to Cart");
                    res.redirect('/viewgamesuser');
                }
            })
        }
    })
}

//see the wishlist
const wishlist = (req,res)=>{
    //check the user
    const email = req.session.email;
    if(!email || typeof email == 'undefined')
    {
        res.redirect('/signin');
        return;
    }
    const Query = `SELECT g.id,g._name from games g join wishlist  w on w.id = g.id where email = '${email}' `;
    connection.query(Query,(err,result)=>{
        if(err)
        {
            res.send('404');
        }else
        {
            res.render('showWishlist',{data : result});
        }
    })


}

//see the cart
const cart = (req,res)=>{
    //check the user
    const email = req.session.email;
    if(!email || typeof email == 'undefined')
    {
        res.redirect('/signin');
        return;
    }
    const Query = `SELECT g.id,g._name from games g join cart c on c.id = g.id where email = '${email}' `;
    connection.query(Query,(err,result)=>{
        if(err)
        {
            res.send('404');
        }else
        {
            res.render('showCart',{data : result});
        }
    })
}

//remove from the cart

const removeCart = (req,res)=>{
    //check the user
    const email = req.session.email;
    if(!email || typeof email == 'undefined')
    {
        res.redirect('/signin');
        return;
    }
    const id = req.params.id;
    const Query =  `delete from cart where email =  '${email}' AND id = ${id}`;
    connection.query(Query,(err,result)=>{
        if(err)
        {
            res.send('404');
        }
        else
        {
            res.redirect('/cart');
        }
    })
}

//remove item from the wishlist
const removeWishlist = (req,res)=>
{
    //check the user
    const email = req.session.email;
    if(!email || typeof email == 'undefined')
    {
        res.redirect('/signin');
        return;
    }
    const id = req.params.id;
    const Query =  `delete from wishlist where email =  '${email}' AND id = ${id}`;
    connection.query(Query,(err,result)=>{
        if(err)
        {
            res.send('404');
        }
        else
        {
            res.redirect('/wishlist');
        }
    })
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

const proceedBill = (req,res)=>{
    const id = req.params.id;   
    const Fname =  req.body.fname;
    const Address = req.body.address;
    const Phone = req.body.phone;
    const City = req.body.city;
    const Province = req.body.province;
    const Quantity = parseInt(req.body.quantity);
    const email = req.session.email;
    //query
    const Query =  `select * from games where id = ${id}`;
    //getting the data of the game
    connection.query(Query,(err,result)=>{
        if(err)
        {
            res.send('404 ERROR');
        }
        else
        {
            let Total =  parseInt(result[0].price) * parseInt(req.body.quantity);
            //insert into the database

            const Query = `INSERT INTO billreport VALUES('${email}','${Fname}','${Phone}','${Quantity}','${Address}','${City}','${Province}','${Total}')`;
            connection.query(Query,(err1,result1)=>{
                if(err1)
                {
                    res.send('404 ERROR');
                }else
                {
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
                }
            })
            
        }
    })
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