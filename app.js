const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

require('dotenv').config()


const v1UserRoutes = require('./v1/routes/user');
const v1GifRoutes = require('./v1/routes/gif');
const v1ArticleRoutes = require('./v1/routes/article');
const v1Feed = require('./v1/routes/feed');

const app = express();

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});

// app.use('/images', express.static(path.join(__dirname, 'images')));

 app.use(bodyParser.json());

// app.use('/api/stuff', stuffRoutes);
// app.use('/api/auth', userRoutes);


app.use('/api/v1/auth', v1UserRoutes);
app.use('/api/v1/gifs', v1GifRoutes);
app.use('/api/v1/articles', v1ArticleRoutes);
app.use('/api/v1/feed', v1Feed);


//router.use('api/v2', v1Routes);


module.exports = app;