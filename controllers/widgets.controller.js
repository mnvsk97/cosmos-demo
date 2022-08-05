const httpStatus = require('http-status')
const mongoose = require('mongoose')
const params = require('params')
const { ObjectId } = mongoose.Types

const { Widget } = require('../models/widget.model')
const { Segment } = require('../models/segment.model')
const { handleValidationError } = require('../utils/error.utils')
const {
  updateWidgetUtil,
  fetchTransformedWidget,
  allowedWidgetReadParams
} = require('../utils/widgets.utils')

const createWidget = async (req, res) => {
  try {
    const allowedParams = [
      'name',
      'layoutType',
      'dataSourceType',
      'dataSource',
      'mapperTemplate',
      'data',
      'header',
      'segmentIds'
    ]

    const filteredParams = params(req.body).only(allowedParams)

    const { segmentIds, name } = req.body

    const filter = { name }

    const existingWidget = await Widget.findOne(filter)
    if (existingWidget) {
      return res
        .status(httpStatus.CONFLICT)
        .send({ message: 'Widget with given name already exists' })
    }

    if (filteredParams.dataSourceType === 'DYNAMIC') {
      if (!filteredParams.dataSource) {
        return res
          .status(httpStatus.BAD_REQUEST)
          .send({ message: 'Data Source is required for dynamic widgets' })
      }
      if (!filteredParams.mapperTemplate) {
        return res
          .status(httpStatus.BAD_REQUEST)
          .send({ message: 'Mapper template is required for dynamic widgets' })
      }
    }

    if (!Array.isArray(filteredParams.segmentIds)) {
      return res
        .status(httpStatus.BAD_REQUEST)
        .send({ message: 'Segments should be an array' })
    }

    for (const id of segmentIds || []) {
      if (!ObjectId.isValid(id)) {
        return res
          .status(httpStatus.BAD_REQUEST)
          .send({ error: `Invalid Segment ID format: ${id}` })
      }

      const segment = await Segment.findById(ObjectId(id))
      if (!segment) {
        return res
          .status(httpStatus.NOT_FOUND)
          .send({ error: `Segment Not Found with given ID : ${id}` })
      }
    }

    const widget = await Widget.create(filteredParams)
    return res.status(httpStatus.CREATED).send(widget)
  } catch (error) {
    console.error(error)
    if (error.name === 'ValidationError') {
      return res
        .status(httpStatus.UNPROCESSABLE_ENTITY)
        .send({ error: handleValidationError(error) })
    }
    return res.status(httpStatus.INTERNAL_SERVER_ERROR)
  }
}

const getWidget = async (req, res) => {
  const { id } = req.params
  try {
    if (!ObjectId.isValid(id)) {
      return res
        .status(httpStatus.BAD_REQUEST)
        .send({ error: `Invalid id format for widget id : ${id}` })
    }

    let widget = await Widget.findById(ObjectId(id))
    if (!widget) {
      return res
        .status(httpStatus.NOT_FOUND)
        .send({ message: `Widget not found with id: ${id}` })
    }

    widget = await fetchTransformedWidget(widget)

    return res.send(params(widget).only(allowedWidgetReadParams))
  } catch (error) {
    console.error(error)
    return res.status(httpStatus.INTERNAL_SERVER_ERROR)
  }
}

const editWidget = async (req, res) => {
  try {
    const { id } = req.params
    if (!ObjectId.isValid(id)) {
      return res
        .status(httpStatus.BAD_REQUEST)
        .send({ message: `Invalid Widget ID format: ${id}` })
    }

    const widget = await Widget.findById(ObjectId(id))
    if (!widget) {
      return res
        .status(httpStatus.NOT_FOUND)
        .send({ message: `Widget not found with given ID: ${id}` })
    }
    const allowedUpdateParams = [
      'dataSource',
      'mapperTemplate',
      'data',
      'header',
      'segmentIds'
    ]

    const updateParams = params(req.body).only(allowedUpdateParams)

    const { segmentIds } = updateParams

    if (!Array.isArray(segmentIds)) {
      return res
        .status(httpStatus.BAD_REQUEST)
        .send({ message: 'Segments should be an array ' })
    }

    for (const segmentId of segmentIds || []) {
      if (!ObjectId.isValid(segmentId)) {
        return res
          .status(httpStatus.BAD_REQUEST)
          .send({ error: `Invalid Segment ID format: ${segmentId}` })
      }

      const segment = await Segment.findById(ObjectId(segmentId))
      if (!segment) {
        return res
          .status(httpStatus.NOT_FOUND)
          .send({ error: `Segment Not Found: ${segmentId}` })
      }
    }

    const updatedWidget = await updateWidgetUtil({
      widget,
      updateParams: params(req.body).only(allowedUpdateParams)
    })

    if (updatedWidget.error) {
      return res
        .status(httpStatus.UNPROCESSABLE_ENTITY)
        .send({ error: updatedWidget.error })
    }

    return res.send(updatedWidget)
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

const listWidgets = async (req, res) => {
  try {
    const { name } = req.query
    const filter = {}

    if (name) {
      filter.name = name
    }

    const widgets = await Widget.find(filter)
    const widgetsList = []

    for (const widget of widgets) {
      const transformedWidget = await fetchTransformedWidget(widget)
      widgetsList.push(params(transformedWidget).only(allowedWidgetReadParams))
    }

    return res.send(widgetsList)
  } catch (error) {
    console.error(error)
    return res.status(httpStatus.INTERNAL_SERVER_ERROR)
  }
}

const listRawWidgets = async (req, res) => {
  try {
    const { name } = req.query
    const filter = {}

    if (name) {
      filter.name = name
    }

    const widgets = await Widget.find(filter)

    return res.send(widgets)
  } catch (error) {
    console.error(error)
    return res.status(httpStatus.INTERNAL_SERVER_ERROR)
  }
}

module.exports = {
  createWidget,
  editWidget,
  getWidget,
  listWidgets,
  listRawWidgets
}
