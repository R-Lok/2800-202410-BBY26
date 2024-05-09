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
