const { BillReport } = require('../models');

const report = async (req, res) => {
    try {
        const quantity = await BillReport.sum('quantity');
        const total_sale = await BillReport.sum('total');
        res.render('adminDashboard', { quantity: quantity || 0, total: total_sale || 0 });
    } catch (err) {
        res.send('404 ERROR');
    }
}

module.exports = { report };