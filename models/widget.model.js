const mongoose = require('mongoose')

const { toJSON } = require('./plugins/toJSON.plugin')

const { Schema, model } = mongoose
const { ObjectId } = mongoose.Types
const { Segment } = require('./segment.model')

const dataSourceTypeEnum = ['STATIC', 'DYNAMIC']

const widgetSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  layoutType: {
    type: String,
    required: [true, 'Layout type is required'],
    trim: true
  },
  dataSourceType: {
    type: String,
    enum: {
      values: dataSourceTypeEnum,
      message: `Data source type can only be one of the following : ${dataSourceTypeEnum.join(', ')}`
    },
    trim: true
  },
  dataSource: {
    url: String,
    headers: [Object],
    body: Object,
    method: String
  },
  mapperTemplate: Object,
  data: [Object],
  header: Object,
  segmentIds: {
    type: [String],
    validate: [
      {
        validator: async (segmentIds) => {
          const segments = await Segment.find({
            _id: {
              $in: segmentIds
                ?.filter((segmentId) => ObjectId.isValid(segmentId))
                .map((segmentId) => mongoose.Types.ObjectId(segmentId))
            }
          })
          return segments.length === segmentIds.length
        },
        message: 'Contains one or more invalid Segment Ids'
      }
    ]
  }
})

// add plugin that converts mongoose to json
widgetSchema.plugin(toJSON)

const Widget = model('widget', widgetSchema)

module.exports = { Widget, widgetSchema }
