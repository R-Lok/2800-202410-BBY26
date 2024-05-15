/* Upload Study Material Animation */
document.addEventListener('DOMContentLoaded', function() {
    const selectDifficulty = document.getElementById('selectDifficulty')
    const selectNumber = document.getElementById('selectNumber')
    const enterTextButton = document.getElementById('enterTextButton')

    function handleSelectChange() {
        if (selectDifficulty.value !== '' && selectNumber.value !== '') {
            enterTextButton.style.display = 'block' // Show the button
        } else {
            enterTextButton.style.display = 'none' // Hide the button
        }
    }

    selectDifficulty.addEventListener('change', handleSelectChange)
    selectNumber.addEventListener('change', handleSelectChange)
})

/* Add event listener to generate button to fetch parameters to our API call endpoint */
function sendApiRequest() {
    const generateBtn = document.getElementById('generateButton')

    generateBtn.addEventListener('click', async () => {
        const flashcardDetails = {
            difficulty: document.getElementById('selectDifficulty').value,
            numQuestions: document.getElementById('selectNumber').value,
            material: document.getElementById('material').value,
        }

        const url = '/api/generate'

        try {
            const loader = document.querySelector('.loading-state')
            loader.style.visibility = 'visible'
            console.log('Start calling API')
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(flashcardDetails),
            })
            // Check if the response is successful
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`)
            }
            // Parse the JSON response
            window.location.href = response.url
            console.log('Finish calling API. ')
        } catch (error) {
            console.error('Error:', error)
        }
    })
}
sendApiRequest()
