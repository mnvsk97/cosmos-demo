const express = require('express')
const segmentsController = require('../controllers/segments.controller')
const router = express.Router()

router
  .post('/', segmentsController.createSegment)
  .get('/:id', segmentsController.getSegment)
  .get('/', segmentsController.listSegments)
  .put('/:id', segmentsController.addEntitiesToSegment)

module.exports = router
