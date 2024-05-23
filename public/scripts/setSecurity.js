function loadSecurityQuestions() {
    document.addEventListener('DOMContentLoaded', async () => {
        await axios
            .get('securityQuestions', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            })
            .then((res) => {
                insertQuestions(res.data)
            })
            .catch((err) => {
                console.log(err)
            })
    })
}

function insertQuestions(questions) {
    const questionOptions = document.querySelectorAll('[id*="question"]')

    questionOptions.forEach((option, i) => {
        option.dataset.questionid = questions[i]._id
        option.value = questions[i]._id
        option.innerHTML = questions[i].question
    })
}

loadSecurityQuestions()

async function submitAnswers() {
    const submitBtn = document.getElementById('submitBtn')

    submitBtn.addEventListener('click', async () => {
        const questionId = document.getElementById('securityQues')
        const answer = document.getElementById('securityAns')

        await axios
            .post('securityQuestions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                questionId: questionId.value,
                answer: answer.value,
            })
            .then((res) => {
                window.location.href = '/'
            })
            .catch((err) => {
                const errorDiv = document.getElementById('error-message')
                errorDiv.innerHTML = `<p style="color: red;">Security information cannot be empty. Try again.</p>`
                // console.log(err.response.data.msg.details[0].message);
            })
    })
}

submitAnswers()
