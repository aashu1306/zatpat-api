const express = require("express");
const app = express();
const morgan = require("morgan");
const cors = require("cors");

const AppError = require("./utils/AppError")
const globalError = require("./controllers/ErrorController")
const rootRouter = require("./routes/router")
const buildAssociations = require("./utils/Associations")

/**
 * Application Logics and functionality
 */
app.use(cors())
app.use(express.urlencoded({ extended: true }))
app.use(express.static('public'))

if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

/**
 * Root Router
 */
app.use('/api/v1/', rootRouter)
/**
 * Build Associations
 */
buildAssociations()

app.all("*", (req, res, next) => {
    next(new AppError(`Can't find ${req.originalUrl}`, 404))
})
app.use(globalError)
module.exports = app;