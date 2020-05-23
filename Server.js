const dotenv = require('dotenv');
const DataBase = require('./models/index');

process.on("uncaughtException", err => {
    console.log(err)
    console.log("Exception:-", err.name, err.message);
})

/**
 * Configure Server
 */
dotenv.config({ path: './config.env' });

DataBase.authenticate().then(res => {
    console.log('Connection has been established successfully.');
}).catch(err => {
    console.error('Unable to connect to the database:', error);
})
 /*DataBase.sync({ alter: true }).then(res => {
     console.log(res)
 }).catch(err => {
     console.log(err)
 })*/

/**
 * Model Relations
 */

const app = require("./app");

/**
 * Start Application server
 */
app.listen(process.env.PORT || 8080, () => {
    console.log("Server listing on port 8080");
});

process.on("unhandledRejection", err => {
    if (err.name === "MongoNetworkError") {
        console.log("Database Connection failed")
    }
    process.exit(1)
})
