/* Delete alert */
function deleteAlert() {
  return confirm('Are you sure you want to delete this restaurant ?')
}

/* Submit form */
function submitForm(event) {
  const form = document.querySelector('.form')
  if (!form.checkValidity()) {
    event.preventDefault()
    event.stopPropagation()
  }
}

/* Click submit button */
function clickSubmit() {
  const form = document.querySelector('.form')
  form.classList.add('was-validated')
}
