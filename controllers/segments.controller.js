const httpStatus = require('http-status')
const params = require('params')
const mongoose = require('mongoose')
const { ObjectId } = mongoose.Types

const { Segment } = require('../models/segment.model')
const { handleValidationError } = require('../utils/error.utils')

const createSegment = async (req, res) => {
  try {
    const allowedParams = [
      'name',
      'entityType',
      'entityIds'
    ]

    const filteredParams = params(req.body).only(allowedParams)

    const filter = { name: req.body.name }
    const existingSegment = await Segment.findOne(filter)

    if (existingSegment) {
      return res.status(httpStatus.CONFLICT).send({ message: 'Segment with the given name already exists.' })
    }

    const segment = await Segment.create(filteredParams)
    return res.status(httpStatus.CREATED).send(segment)
  } catch (error) {
    console.error(error)
    return res.status(httpStatus.INTERNAL_SERVER_ERROR)
  }
}

const getSegment = async (req, res) => {
  try {
    const { id } = req.params
    if (!ObjectId.isValid(id)) {
      return res
        .status(httpStatus.BAD_REQUEST)
        .send({ error: `Invalid Segment ID format: ${id}` })
    }

    const segment = await Segment.findById(ObjectId(id))
    if (!segment) {
      return res.status(httpStatus.NOT_FOUND).send({ error: `Segment Not Found: ${id}` })
    }

    return res.send(segment)
  } catch (error) {
    console.error(error)
    return res.status(httpStatus.INTERNAL_SERVER_ERROR)
  }
}

const listSegments = async (req, res) => {
  try {
    const { name, entityType, entityId } = req.query
    const filter = {}

    if (name) { filter.name = name }

    if (entityType) { filter.entityType = entityType }

    if (entityId) {
      filter.entityId = entityId
    }

    const segments = await Segment.find(filter)
    return res.send(segments)
  } catch (error) {
    console.error(error)
    return res.status(httpStatus.INTERNAL_SERVER_ERROR)
  }
}

const addEntitiesToSegment = async (req, res) => {
  try {
    const { id } = req.params
    if (!ObjectId.isValid(id)) {
      return res
        .status(httpStatus.BAD_REQUEST)
        .send({ message: `Invalid Segment ID format: ${id}` })
    }

    const segment = await Segment.findById(ObjectId(id))
    if (!segment) {
      return res
        .status(httpStatus.NOT_FOUND)
        .send({ message: `Segment not found with given ID: ${id}` })
    }
    const allowedUpdateParams = [
      'entityIds'
    ]

    const updateParams = params(req.body).only(allowedUpdateParams)
    const entityIds = updateParams.entityIds

    if (!Array.isArray(entityIds)) {
      return res.status(httpStatus.BAD_REQUEST).send({ message: 'entityIds should be an array ' })
    }

    segment.set({ entityIds })
    const updatedSegment = await segment.save()

    if (updatedSegment.error) {
      return res
        .status(httpStatus.UNPROCESSABLE_ENTITY)
        .send({ error: updatedSegment.error })
    }

    return res.send(updatedSegment)
  } catch (error) {
    console.log(error)
    if (error.name === 'ValidationError') {
      return res
        .status(httpStatus.UNPROCESSABLE_ENTITY)
        .send({ error: handleValidationError(error) })
    }
    return res.status(httpStatus.INTERNAL_SERVER_ERROR)
  }
}

module.exports = {
  createSegment,
  getSegment,
  listSegments,
  addEntitiesToSegment
}
