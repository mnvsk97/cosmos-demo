const axios = require('axios')
const ST = require('selecttransform').SelectTransform
const st = new ST()

const allowedWidgetReadParams = [
  'name',
  'layoutType',
  'dataSourceType',
  'data',
  'header',
  'segmentIds',
  'color',
  'id'
]

const updateWidgetUtil = async (params) => {
  const { widget, updateParams } = params
  const { data, header, segmentIds, mapperTemplate } =
      updateParams

  widget.set({
    data: data || widget.data,
    header: header || widget.header,
    segmentIds: segmentIds || widget.segmentIds,
    mapperTemplate: mapperTemplate || widget.mapperTemplate
  })
  await widget.save()
  return widget
}

const fetchTransformedWidget = async (widget) => {
  if (widget.dataSourceType === 'DYNAMIC') {
    return await fetchDataFromSource(widget)
  }

  return widget
}

const fetchDataFromSource = async (widget) => {
  const { mapperTemplate, dataSource } = widget
  const { method, url, body } = dataSource
  if (!dataSource) {
    throw new Error(`Data source is not defined for widget with id : ${widget.id}`)
  }

  if (!mapperTemplate) {
    throw new Error(`Mapper template is not defined for widget with id : ${widget.id}`)
  }

  const response = await axios({ method, url, data: body })

  const manipulatedFields = st.transformSync(mapperTemplate, response.data)

  return { ...widget._doc, ...manipulatedFields, id: widget._id }
}

module.exports = {
  updateWidgetUtil,
  fetchTransformedWidget,
  allowedWidgetReadParams
}
