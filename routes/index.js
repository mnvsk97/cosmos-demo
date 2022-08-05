const express = require('express')
const router = express.Router()

const pagesRoute = require('./pages.route')
const widgetsRoute = require('./widgets.route')
const segmentsRoute = require('./segments.route')

router.get('/ping', function (_req, res, next) {
  res.send({ message: 'hello world' })
  next()
})

const routes = [
  {
    path: '/pages',
    route: pagesRoute
  },
  {
    path: '/widgets',
    route: widgetsRoute
  },
  {
    path: '/segments',
    route: segmentsRoute
  }
]

routes.forEach((route) => {
  router.use(route.path, route.route)
})

module.exports = router
