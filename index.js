'use strict';

require('dotenv').config();
const express = require('express');
const app = express();
const port = process.env.PORT || 5000;
const expressHandlebars = require('express-handlebars');
const { createStarList } = require('./controllers/handlebarsHelper');
const { createPagination } = require('express-handlebars-paginate');
const session = require('express-session');
const redisStore = require('connect-redis').default;
const { createClient } = require('redis');
const redisClient = createClient({
    url: process.env.REDIS_URL
});
redisClient.connect().catch(console.error);


app.use(express.static(__dirname + '/public'));

//configure handlebars
app.engine('hbs', expressHandlebars.engine({
    layoutsDir: __dirname + '/views/layouts',
    partialsDir: __dirname + '/views/partials',
    extname: 'hbs',
    defaultLayout: 'layout',
    runtimeOptions: {
        allowProtoPropertiesByDefault: true
    },
    helpers : {
        createStarList,
        createPagination
    }
}));
app.set('view engine', 'hbs');

//configure POST request
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

//configure session
app.use(session({
    secret: process.env.SESSION_SECRET,
    store: new redisStore({ client: redisClient }),
    resave: false,
    saveUninitialized: false,
    cookie: {
        httpOnly: true,
        maxAge: 20 * 60 * 1000 // 20mins
    }
}));

//middlewares
app.use((req, res, next) => {
    let Cart = require('./controllers/cart');
    req.session.cart = new Cart((req.session.cart ? req.session.cart : {}));
    res.locals.quantity = req.session.cart.quantity;

    next();
})

//routes
app.use('/', require('./routes/indexRouter'));
app.use('/products', require('./routes/productsRouter'));
app.use('/users', require('./routes/usersRouter'));

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