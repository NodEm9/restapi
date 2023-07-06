const express = require('express');
const server = express();
const path = require( 'path')
const cors = require( 'cors');
const helmet = require( 'helmet');
const morgan = require( 'morgan');
const port = process.env.PORT || 3500;

server.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`)
  next();
});

//Import allowedOrigins
const allowedOrigins = require('./config/allowedOrigins');

const userRouters = require('./router/user.js')
 
//Middleware
server.use(express.json());
server.use(cors())
server.use(helmet());
server.use(morgan('combined'));

server.use(express.urlencoded({ extended: false }))
server.use(express.static('server'));

server.use('/api/v1/users', userRouters);


// server.get('/page', (req, res, next) => {
//   console.log('Connecting... to Page ')
//   next()
// }, (req, res) => {
//   res.send('Hello World!')
// })


// Add Access Control Allow Origin headers
server.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", allowedOrigins);
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept"
    );

    next();
}); 
server.listen(port, () => {
    console.log(`Server started on ${port}`);
});   

module.exports = server;