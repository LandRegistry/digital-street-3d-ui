const formErrorDataElement = document.getElementById('form-error-data')

// Only carry on if we have found a script block containing the form error json
if (formErrorDataElement) {
  const formErrorData = JSON.parse(formErrorDataElement.innerHTML)
  const formName = formErrorDataElement.getAttribute('data-form-name')

  formErrorData.forEach(item => {
    item.errors.forEach(error => {
      window.gtag('event', `${formName} : ${item.name}`, {
        'event_category': 'FormValidation',
        'event_label': error
      })
    })
  })
}
