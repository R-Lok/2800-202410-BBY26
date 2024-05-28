// Fetch all available questions from users
async function getQuestion(email) {
    if (email.length == 0) {
        displayerErrorLoader("Email cannot be empty. Try again.");
        return;
    } 
    axios.get(`/securityQuestions/${email}`)
        .then((res) => {
            if (res.status === 200) {
                displayLoader()
                setStepTwoQuestion(res.data)
                setTimeout(() => {
                    switchStep(2)
                    closeLoader('.wrapper')
                }, 1500)
            }
        }).catch((err) => {
            displayerErrorLoader(err.response.data.msg)
        })
}

// Pass email to getQuestion function
function startStepOne() {
    const email = document.getElementById('userEmail').value
    getQuestion(email)
}

// Add event handlers to start getQuestion function
function activateBtn(step, next) {
    const submitBtn = document.getElementById(`step-${step}-submit`)

    submitBtn.addEventListener('click', next)
}
activateBtn(1, startStepOne)

// Transition from step 1 to step 2. Add userID to localStorage
function setStepTwoQuestion(result) {
    const { question, questionId, userId } = result
    const questionInput = document.getElementById('securityQues')
    questionInput.value = question
    questionInput.questionId = questionId
    localStorage.setItem('userId', userId)
}

// POST security answer to database for user input validation
async function checkAnswer() {
    const answer = document.getElementById('securityAns').value
    if (answer.length == 0) {
        displayerErrorLoader("Answer cannot be empty");
        return;
    } 
    await axios.post('/securityQuestions/checkAnswer', {
        headers: {
            'Content-Type': 'application/json',
        },
        userId: localStorage.getItem('userId'),
        questionId: document.getElementById('securityQues').questionId,
        answer: document.getElementById('securityAns').value,
    }).then((res) => {
        if (res.status === 200) {
            displayLoader()
            setTimeout(() => {
                switchStep(3)
                closeLoader('.wrapper')
            }, 1500)
        }
    }).catch((err) => {
        console.log(err);
        displayerErrorLoader(err.response.data.msg)
    })
}
activateBtn(2, checkAnswer)

// POST user new password to database
async function resetPassword() {
    const password = document.getElementById('newPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    if (password.length == 0) {
        displayerErrorLoader("New password cannot be empty");
        return;
    } else if (confirmPassword.length == 0) {
        displayerErrorLoader("Please confirm your password first.");
        return;
    }
    await axios.post('resetPassword', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        userId: localStorage.getItem('userId'),
        password: document.getElementById('newPassword').value,
        confirmPassword: document.getElementById('confirmPassword').value,
    }).then((res) => {
        if (res.status === 200) {
            displayLoader()
            setTimeout(() => {
                switchStep(4)
                closeLoader('.wrapper')
            }, 1500)
        }
    }).catch((err) => {
        console.log(err)
        displayerErrorLoader(err.response.data.msg.details[0].message)
    })
}
activateBtn(3, resetPassword)

// Redirect user to login page
function redirectLogin() {
    window.location.href = '/login'
}

activateBtn(4, redirectLogin)

// Display loading animation and error message
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

// Display error loader when users give invalid inputs
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

// Change steps for the modal
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

// Close loading animation
function closeLoader(className) {
    const loader = document.querySelector(`${className}`)
    loader.remove()
}

const modal = document.getElementById('resetPasswordModal')
const config = { attributes: true }
// Function to observe changes in the modal
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


