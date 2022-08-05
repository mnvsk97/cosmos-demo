const express = require('express')
const pagesController = require('../controllers/pages.controller')
const router = express.Router()

router
  .post('/', pagesController.createPage)
  .get('/', pagesController.listPages)
  .get('/:id', pagesController.getPage)
  .get('/:id/widgets', pagesController.getPageWidgets)
  .put('/:id/widgets', pagesController.updatePageWidgets)

module.exports = router
