const connection = require('../config/sqlConnection');

const report = (req,res)=>{
    const Query = `select SUM(quantity) as quantity,SUM(total) as total_sale from billreport`;
    connection.query(Query,(err,result)=>{
        if(err){
            res.send('404 ERROR');
        }else{
            res.render('adminDashboard',{quantity : result[0].quantity,total : result[0].total_sale})
        }
    })
}

module.exports = {report};