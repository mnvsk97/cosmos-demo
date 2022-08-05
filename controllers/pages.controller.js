const httpStatus = require('http-status')
const params = require('params')
const mongoose = require('mongoose')
const { ObjectId } = mongoose.Types

const { Page } = require('../models/page.model')
const { extractWidgetsFromPage, addWidgetsToPage } = require('../utils/pages.utils')
const { Widget } = require('../models/widget.model')

const pageReadParams = [
  'name',
  'description',
  'type',
  'isActive',
  'startDate',
  'endDate'
]

const createPage = async (req, res) => {
  try {
    const allowedParams = [
      'name',
      'description',
      'type',
      'startDate',
      'endDate'
    ]

    const filteredParams = params(req.body).only(allowedParams)

    const page = await Page.create(filteredParams)
    return res.status(httpStatus.CREATED).send(page)
  } catch (error) {
    console.error(error)
    return res.status(httpStatus.INTERNAL_SERVER_ERROR)
  }
}

const getPage = async (req, res) => {
  const { id } = req.params
  try {
    if (!ObjectId.isValid(id)) {
      return res
        .status(httpStatus.BAD_REQUEST)
        .send({ error: 'Invalid Page ID format' })
    }

    const page = await Page.findById(ObjectId(id))
    if (!page) {
      return res.status(httpStatus.NOT_FOUND).send({ error: `Page Not Found with id: ${id}` })
    }

    return res.send(page)
  } catch (error) {
    console.error(error)
    return res.status(httpStatus.INTERNAL_SERVER_ERROR)
  }
}

const listPages = async (req, res) => {
  try {
    const { name } = req.query
    const filter = {}

    if (name) { filter.name = name }

    const pages = await Page.find(filter)
    return res.send(pages)
  } catch (error) {
    console.error(error)
    return res.status(httpStatus.INTERNAL_SERVER_ERROR)
  }
}

const getAllPageWidgets = async (req, res) => {
  try {
    const { id } = req.params

    if (!ObjectId.isValid(id)) {
      return res.status(httpStatus.BAD_REQUEST).send({ message: `Invalid Page ID format: ${id}` })
    }

    const page = await Page.findById(ObjectId(id))
    if (!page) {
      return res.status(httpStatus.BAD_REQUEST).send({ message: `Page does not exist with given page Id : ${id}` })
    }
    const leanPage = params(page).only(pageReadParams)

    // TODO : we need to make sure to delete widget ids from page records when a widget is deleted
    const widgets = await extractWidgetsFromPage(page)
    return res.send({ widgets })
  } catch (error) {
    console.error(error)
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).send()
  }
}

const updatePageWidgets = async (req, res) => {
  try {
    const { id } = req.params
    if (!ObjectId.isValid(id)) {
      return res.status(httpStatus.BAD_REQUEST).send()
    }

    const page = await Page.findById(ObjectId(id))
    if (!page) {
      return res.status(httpStatus.BAD_REQUEST).send({ message: `Page does not exist with given page Id : ${id} ` })
    }

    const allowedParams = [
      'widgets'
    ]
    const { widgets } = params(req.body).only(allowedParams)

    if (!Array.isArray(widgets)) {
      return res.status(httpStatus.BAD_REQUEST).send({ message: 'Widgets should be an array ' })
    }

    for (let i = 0; i < widgets.length; i++) {
      // TODO : Add a validation to disallow widgets array with same ids. ex: [{id: 1}, {id: 1}] should not be allowed
      const { id } = widgets[i]
      if (!ObjectId.isValid(id)) {
        return res.status(httpStatus.BAD_REQUEST).send({ message: `Invalid id format for widget id : ${id}` })
      }

      const widget = await Widget.findById(ObjectId(id))
      if (!widget) {
        return res.status(httpStatus.BAD_REQUEST).send({ message: `Widget does not exist with id : ${id}` })
      }
    }

    const updatedPage = await addWidgetsToPage(page, widgets)
    return res.send({ page: updatedPage })
  } catch (error) {
    console.error(error)
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).send()
  }
}

const getPageWidgets = async (req, res) => {
  try {
    const { id } = req.params
    const { entity } = req.body

    if (!ObjectId.isValid(id)) {
      return res.status(httpStatus.BAD_REQUEST).send({ message: `Invalid Page ID format: ${id}` })
    }

    if (entity && !Array.isArray(entity)) {
      return res.status(httpStatus.BAD_REQUEST).send({ message: 'entity should be an array or null' })
    }

    const page = await Page.findById(ObjectId(id))
    if (!page) {
      return res.status(httpStatus.BAD_REQUEST).send({ message: `Page does not exist with given page Id : ${id}` })
    }
    const leanPage = params(page).only(pageReadParams)

    const widgets = await extractWidgetsFromPage(page, entity)
    return res.send({...leanPage, widgets: widgets})
  } catch (error) {
    console.error(error)
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).send()
  }
}

module.exports = {
  createPage,
  getPage,
  listPages,
  getAllPageWidgets,
  updatePageWidgets,
  getPageWidgets
}
