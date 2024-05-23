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
        })
})
