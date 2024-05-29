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
            if (err.response.status === 422) {
                console.log(error);
                displayErrorMessage(err.response.data.msg.details[0].message);
            } else if (err.response.status === 401) {
                console.log(error);
                displayErrorMessage(err.response.data.msg);
            }
            
        })
})

function displayErrorMessage(message) {
    const passwordInput = document.getElementById('password');
    const loginIdInput = document.getElementById('loginId');
    const messageElem = document.querySelector('.invalid-feedback')
    messageElem.innerHTML = message;
    loginIdInput.classList.add('is-invalid');
    passwordInput.classList.add('is-invalid');
}
