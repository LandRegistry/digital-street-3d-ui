const formErrorDataElement = document.getElementById('form-error-data')

// Only carry on if we have found a script block containing the form error json
if (formErrorDataElement) {
  const formErrorData = JSON.parse(formErrorDataElement.innerHTML)
  const formName = formErrorDataElement.getAttribute('data-form-name')

  buildErrorData(formErrorData).forEach(item => {
    item.errors.forEach(error => {
      window.gtag('event', `${formName} : ${item.name}`, {
        'event_category': 'FormValidation',
        'event_label': error
      })
    })
  })
}

function buildErrorData (data) {
  var ret = []

  Object.entries(data).forEach(group => {
    if (Array.isArray(group[1])) {
      ret.push({
        name: group[0],
        errors: group[1]
      })
    } else {
      const subData = buildErrorData(group[1])

      ret = ret.concat(subData.map(item => {
        return {
          name: `${group[0]}-${item.name}`,
          errors: item.errors
        }
      }))
    }
  })

  return ret
}
