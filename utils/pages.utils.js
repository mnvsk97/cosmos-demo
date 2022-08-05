const params = require('params')

const { Widget } = require('../models/widget.model')
const { Segment } = require('../models/segment.model')
const {
  fetchTransformedWidget,
  allowedWidgetReadParams
} = require('../utils/widgets.utils')

const pageReadParams = [
  'name',
  'description',
  'type',
  'isActive',
  'startDate',
  'endDate'
]

const addWidgetsToPage = async (page, widgets) => {
  // TODO - Check if same widget already exists and update only rank if widget exists
  page.set({ widgets })
  await page.save()
  return page
}

const getEntityIdForSegment = async(entity, entityType) => {
  if(!entity) {
    return null;
  }
  for(const obj of entity) {
    if(entityType === obj.type)
      return obj.id
  }
  return null
}

const extractWidgetsFromPage = async (page, entity) => {
  const widgetsList = []
  for (const widget of page.widgets) {
    // TODO : replace this with 1. find all widgets in one db call 2. create a list of widgets with rank added to them
    const widgetDocument = await Widget.findById(widget.id)
    const transformedWidget = params(await fetchTransformedWidget(widgetDocument)).only(allowedWidgetReadParams)
    const widgetSegmentIds = transformedWidget.segmentIds
    if (!widgetSegmentIds || widgetSegmentIds.length === 0) {
      widgetsList.push({ ...transformedWidget, rank: widget.rank })
    } else {
      const segments = await Segment.find({ id: { $in: widgetSegmentIds } })
      for (const segment of segments) {
        const entityId = await getEntityIdForSegment(entity, segment.entityType)
        if (entityId && segment.entityIds.includes(entityId)) {
          widgetsList.push({ ...transformedWidget, rank: widget.rank })
          break
        }
      }
    }
  }

  return widgetsList
}

module.exports = { extractWidgetsFromPage, addWidgetsToPage, allowedWidgetReadParams }
