const auth = (req,res,next)=>
{
    const role = req.session.role;
    if(typeof role == 'undefined' || !role || role!='admin')
    {
        return res.render('signin');
    }
    next();
}

module.exports = {auth};