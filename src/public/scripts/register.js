const form = document.getElementById('form-register')
form.addEventListener('submit', (e) => {
    e.preventDefault()
    const formData = new FormData(form)
    const data = {}
    formData.forEach((value, key) => {
        data[key] = value
    })

    return axios('/register', {
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
            console.log(err)
            displayErrorMessage(err.response.data.msg.details[0].message);
        })
})

function displayErrorMessage(message) {
    const displayNameInput = document.getElementById('displayName');
    const emailInput = document.getElementById('email');
    const loginIdInput = document.getElementById('loginId');
    const passwordInput = document.getElementById('password');
    const confirmPasswordInput = document.getElementById('confirmPassword');

    const messageElem = document.querySelector('.invalid-feedback')
    messageElem.innerHTML = message;
    displayNameInput.classList.add('is-invalid');
    emailInput.classList.add('is-invalid');
    loginIdInput.classList.add('is-invalid');
    passwordInput.classList.add('is-invalid');
    confirmPasswordInput.classList.add('is-invalid');
}
