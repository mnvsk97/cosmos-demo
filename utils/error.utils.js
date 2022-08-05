const handleValidationError = (err) => {
  let message
  const key = Object.keys(err.errors)
  message = `Invalid ${err.errors[key[0]].path}: ${err.errors[key[0]].value}.`
  if (err.errors[key[0]] && err.errors[key[0]].properties) {
    message = err.errors[key[0]].properties.message
  }
  return message
}

module.exports = { handleValidationError }
