const express = require('express')
const logger = require('morgan')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const cors = require('cors')

const config = require('./config')

const routes = require('./routes/index')

const server = express()

server.use(cors())
server.use(logger('dev'))
server.use(bodyParser.json())

// Routes
server.use('/', routes)

// catch 404 and forward to error handler
server.use(function (req, res, next) {
  res.sendStatus(404)
})

// Initialize mongoDB connection
mongoose.connect(config.mongoose.uri, config.mongoose.options)

const db = mongoose.connection
db.on('error', console.error.bind(console, 'connection error: '))
db.on('open', () => {
  console.log('Connected to MongoDB')

  server.listen(config.port, () => {
    console.log(`App server listening on port : ${config.port}`)
  })
})
