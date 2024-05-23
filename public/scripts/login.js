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
            console.log(err)
        })
})
