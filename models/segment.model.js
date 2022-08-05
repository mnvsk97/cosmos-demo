const mongoose = require('mongoose')

const { toJSON } = require('./plugins/toJSON.plugin')

const { Schema, model } = mongoose
const { ObjectId } = mongoose.Types

const entityTypeEnum = ['USER', 'CLASS']

const segmentSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  entityType: {
    type: String,
    enum: {
      values: entityTypeEnum,
      message: `Entity type can only be one of the following : ${entityTypeEnum.join(', ')}`
    },
    trim: true
  },
  entityIds: {
    type: [String]
  }
})

// add plugin that converts mongoose to json
segmentSchema.plugin(toJSON)

const Segment = model('segment', segmentSchema)

module.exports = { Segment, segmentSchema }
