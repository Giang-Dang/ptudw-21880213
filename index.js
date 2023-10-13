'use strict';

const express = require('express');
const app = express();
const port = process.env.PORT || 5000;
const expressHandlebars = require('express-handlebars');
const { createStarList } = require('./controllers/handlebarsHelper');

app.use(express.static(__dirname + '/public'));

app.engine('hbs', expressHandlebars.engine({
    layoutsDir: __dirname + '/views/layouts',
    partialsDir: __dirname + '/views/partials',
    extname: 'hbs',
    defaultLayout: 'layout',
    runtimeOptions: {
        allowProtoPropertiesByDefault: true
    },
    helpers : {
        createStarList
    }
}));
app.set('view engine', 'hbs');

app.use('/', require('./routes/indexRouter'));

app.use('/products', require('./routes/productsRouter'));

app.use((req, res, next) => {
    res.status(404).render('error', { message: 'File not found!' });
});

app.use((error, req, res, next) => {
    console.error(error);
    res.status(500).render('error', { message: 'Internal Server Error!' });
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});