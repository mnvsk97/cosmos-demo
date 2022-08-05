const express = require('express')
const widgetsController = require('../controllers/widgets.controller')
const router = express.Router()

router
  .post('/', widgetsController.createWidget)
  .get('/', widgetsController.listWidgets)
  .get('/raw', widgetsController.listRawWidgets)
  .put('/:id', widgetsController.editWidget)
  .get('/:id', widgetsController.getWidget)

module.exports = router
