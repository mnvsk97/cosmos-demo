const mongoose = require('mongoose')
const { toJSON } = require('./plugins/toJSON.plugin')
const { Widget } = require('./widget.model')

const { Schema, model } = mongoose
const { ObjectId } = mongoose.Types
const pageTypeEnum = ['LIST']
const endDateDefault = Date.UTC(2099, 12, 31, 23, 59, 59)

const pageSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  description: String,
  type: {
    type: String,
    enum: {
      values: pageTypeEnum,
      message: `Page type is either ${pageTypeEnum.join(', ')}`
    },
    default: 'LIST',
    required: [true, 'Page type is required'],
    trim: true
  },
  isActive: {
    type: Boolean,
    default: true
  },
  startDate: {
    type: Date,
    default: Date.now()
  },
  endDate: {
    type: Date,
    default: endDateDefault
  },
  widgets: [
    {
      id: {
        type: String,
        required: true,
        validate: [
          {
            validator: (widgetId) => ObjectId.isValid(widgetId),
            message: 'Invalid widgetId format'
          },
          {
            validator: async (widgetId) => await Widget.findById(ObjectId(widgetId)),
            message: 'Widget does not exist with given widgetId'
          }
        ]
      },
      rank: {
        type: Number,
        required: true
      }
    }
  ]
})

pageSchema.plugin(toJSON)

const Page = model('Page', pageSchema)

module.exports = { Page, pageSchema }
