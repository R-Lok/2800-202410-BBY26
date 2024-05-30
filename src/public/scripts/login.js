const form = document.getElementById('form-login')
form.addEventListener('submit', (e) => {
    e.preventDefault()
    const formData = new FormData(form)
    const data = {}
    formData.forEach((value, key) => {
        data[key] = value
    })

    return axios('/login', {
        method: 'post',
        headers: {
            'Content-Type': 'application/json',
        },
        data: data,
    })
        .then(() => {
            return window.location.href = '/'
        })
        .catch((err) => {
            const {message, key, statusText} = filterError(err);
            displayErrorMessage(message, key, statusText)
        })
})

// Filter error type depending on whether it's joi error response or database error response
function filterError(err) {
    let message, key, statusText;
    if (err.response.statusText === "Unprocessable Entity") {
        message = err.response.data.msg.details[0].message
        key = err.response.data.msg.details[0].context.key
    } else if (err.response.statusText === "Unauthorized") {
        message = err.response.data.msg
        statusText = "Unauthorized"
        key = "loginId"
    } else {
        message = err.response.data.msg
        key = "loginId"
    }
    return {message, key, statusText}
}

// Display error message below the corresponding form field
function displayErrorMessage(message, key, statusText) {
    document.querySelectorAll('.invalid-feedback').forEach((elem) => {
        elem.innerHTML = "";
    })
    document.querySelectorAll('.login-input').forEach((elem) => {
        elem.value = "";
        elem.classList.remove('is-invalid');
    })

    if (statusText === "Unauthorized") {
        document.querySelectorAll('.login-input').forEach((elem) => {
            elem.classList.add('is-invalid');
            document.getElementById(`${key}-feedback`).innerHTML = message;
            return;
        })
    }
    const elem = document.querySelector(`input[name=${key}]`);
    const messageElem = document.getElementById(`${key}-feedback`);
    messageElem.innerHTML = `<p>${message}</p>`;
    elem.classList.add('is-invalid');
}
