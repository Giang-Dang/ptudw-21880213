let controller = {};

const models = require('../models');

controller.show = async (req, res) => {
    let products = await models.Product.findAll({
        attributes: ['id', 'name', 'imagePath', 'stars', 'price', 'oldPrice'],

    });

    res.locals.products = products;
    res.render('product-list');
}

module.exports = controller;