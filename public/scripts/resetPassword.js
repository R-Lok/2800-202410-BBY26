async function getQuestion(email) {
    axios.post('getQuestion', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        email: email,
    }).then((res) => {
        console.log(res)

        if (res.status === 200) {
            displayLoader()
            setStepTwoQuestion(res.data.result)
            setTimeout(() => {
                switchStep(2)
                closeLoader('.wrapper')
            }, 1500)
        }
    }).catch((err) => {
        console.log(err.response)
        displayerErrorLoader(err.response.data.msg)
    })
}

function startStepOne() {
    const email = document.getElementById('userEmail').value
    getQuestion(email)
}

function activateBtn(step, next) {
    const submitBtn = document.getElementById(`step-${step}-submit`)

    submitBtn.addEventListener('click', next)
}

activateBtn(1, startStepOne)

function setStepTwoQuestion(result) {
    const { question, questionId, userId } = result
    const questionInput = document.getElementById('securityQues')
    questionInput.value = question
    questionInput.questionId = questionId
    localStorage.setItem('userId', userId)
}

async function checkAnswer() {
    await axios.post('checkAnswer', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        userId: localStorage.getItem('userId'),
        questionId: document.getElementById('securityQues').questionId,
        answer: document.getElementById('securityAns').value,
    }).then((res) => {
        if (res.data.result.localeCompare('ok') === 0) {
            displayLoader()
            setTimeout(() => {
                switchStep(3)
                closeLoader('.wrapper')
            }, 1500)
        }
    }).catch((err) => {
        console.log(err.response)
        displayerErrorLoader(err.response.data.msg)
    })
}

activateBtn(2, checkAnswer)

async function resetPassword() {
    await axios.post('resetPassword', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        userId: localStorage.getItem('userId'),
        password: document.getElementById('newPassword').value,
        confirmPassword: document.getElementById('confirmPassword').value,
    }).then((res) => {
        if (res.data.result.localeCompare('ok') === 0) {
            displayLoader()
            setTimeout(() => {
                switchStep(4)
                closeLoader('.wrapper')
            }, 1500)
        }
    }).catch((err) => {
        console.log(err)
        displayerErrorLoader('')
    })
}

activateBtn(3, resetPassword)

function redirectLogin() {
    window.location.href = '/login'
}

activateBtn(4, redirectLogin)

/* loading animation and error message */
function displayLoader() {
    const modalBody = document.querySelector('.modal-body')
    const loader = document.createElement('div')
    loader.classList.add('wrapper')
    loader.innerHTML = `
    <svg class="checkmark" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52"> 
        <circle class="checkmark__circle" cx="26" cy="26" r="25" fill="none"/> 
        <path class="checkmark__check" fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8"/>
    </svg>
    `
    modalBody.appendChild(loader)
}

function displayerErrorLoader(message) {
    const modalBody = document.querySelector('.modal-body')

    const loader = document.createElement('div')
    loader.classList.add('errorWrapper')
    loader.innerHTML = `
    <svg class="error" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52">
        <circle class="error_circle" cx="26" cy="26" r="25" fill="none"/>
        <path class="error_check" fill="none" d="M14.1 14.1l23.8 23.8 m0,-23.8 l-23.8,23.8"/>
    </svg>
    `
    const text = document.createElement('h4')
    text.innerHTML = message
    text.classList.add('error-message')
    text.style.textAlign = 'center'

    loader.appendChild(text)
    modalBody.appendChild(loader)
}


/* Change steps for the modal */
function switchStep(step) {
    for (let i = 1; i <= 4; i++) {
        const elem = document.getElementById(`step-${i}`)

        if (i === step) {
            elem.style.visibility = 'visible'
            elem.style.maxHeight = ''
        } else {
            elem.style.visibility = 'hidden'
            elem.style.maxHeight = 0
        }
    }
}

function closeLoader(className) {
    const loader = document.querySelector(`${className}`)
    loader.remove()
}

const modal = document.getElementById('resetPasswordModal')
const config = { attributes: true }
const callback = (mutationList, observer) => {
    for (const mutation of mutationList) {
        if (mutation.type === 'attributes' && !modal.classList.contains('show')) {
            switchStep(1)

            document.querySelectorAll('input').forEach((input) => input.value = '')

            const loader = document.querySelector('.wrapper')
            if (loader) {
                loader.remove()
            }
            const errorLoader = document.querySelector('.errorWrapper')
            if (errorLoader) {
                errorLoader.remove()
            }
        }
    }
}
const observer = new MutationObserver(callback)
observer.observe(modal, config)


