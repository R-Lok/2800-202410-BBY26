async function getQuestion(email) {
    try {
        const res = await axios.post('getQuestion', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            email: email,
        })

        console.log(res)

        if (res.status === 200) {
            displayLoader()
            setStepTwoQuestion(res.data.result)
            setTimeout(() => {
                switchStep(2)
                closeLoader()
            }, 1500)
        } else {
            displayErrorMsg(res.statusText)
        }
    } catch (err) {
        console.log(err)
    }
}

function startStepOne() {
    const email = document.getElementById('userEmail').value
    console.log('Email: ' + email)
    getQuestion(email)
}

function activateBtn(step, next) {
    const submitBtn = document.getElementById(`step-${step}-submit`)

    submitBtn.addEventListener('click', next)
}

activateBtn(1, startStepOne)

function setStepTwoQuestion(result) {
    const { question, questionId } = result
    const questionInput = document.getElementById('securityQues')
    questionInput.value = question
    questionInput.questionId = questionId
}

async function checkAnswer() {
    try {
        const res = await axios.post('checkAnswer', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            email: document.getElementById('userEmail').value,
            questionId: document.getElementById('securityQues').questionId,
            answer: document.getElementById('securityAns').value,
        })

        if (res.data.result.localeCompare('ok') === 0) {
            displayLoader()
            setTimeout(() => {
                switchStep(3)
                closeLoader()
            }, 1500)
        }
    } catch (err) {
        console.log(err)
    }
}

activateBtn(2, checkAnswer)

async function resetPassword() {
    try {
        const res = await axios.post('resetPassword', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            email: document.getElementById('userEmail').value,
            password: document.getElementById('newPassword').value,
            confirmPassword: document.getElementById('confirmPassword').value,
        })

        if (res.data.result.localeCompare('ok') === 0) {
            displayLoader()
            setTimeout(() => {
                switchStep(4)
                closeLoader()
            }, 1500)
        }
    } catch (err) {
        console.log(err)
    }
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

function closeLoader() {
    const loader = document.querySelector('.wrapper')
    loader.remove()
}

function displayErrorMsg(err) {
    document.getElementById('step-1-form').innerHTML = `${err}`
}

const modal = document.getElementById('resetPasswordModal')
const config = { attributes: true }
const callback = (mutationList, observer) => {
    for (const mutation of mutationList) {
        if (mutation.type === 'attributes' && !modal.classList.contains('show')) {
            const loader = document.querySelector('.wrapper')

            if (loader) {
                loader.remove()
            }
        }
    }
}
const observer = new MutationObserver(callback)
observer.observe(modal, config)

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
