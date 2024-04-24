//IMPORT PACKAGE
const express = require('express');
const morgan = require('morgan');
const moviesRouter = require('./Routes/movies.route');
const CustomError = require('./Utils/CustomError')
const globalErrorHandler = require('./Controllers/error.controller')

let app = express();

const logger = function(req, res, next){
    // console.log('Custom middleware called');
    next();
}

app.use(express.json());

if(process.env.NODE_ENV === 'development'){
    app.use(morgan('dev'))
}

app.use(express.static('./public'))
app.use(logger);
app.use((req, res, next) => {
    req.requestedAt = new Date().toISOString();
    next();
})

//USING ROUTES
app.use('/api/v1/movies', moviesRouter)
app.all('*', (req, res, next) => {
    // res.status(404).json({
    //     status: 'fail',
    //     message: `Can't find ${req.originalUrl} on the server`
    // })
    // const err = new Error(`Can't find ${req.originalUrl} on the server`)
    // err.status = 'fail'
    // err.statusCode = 404
    const err = new CustomError(`Can't find ${req.originalUrl} on the server`, 404)
    next(err)
})

app.use(globalErrorHandler)

module.exports = app;
