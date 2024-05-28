// Waits until DOM content is fully loaded
document.addEventListener('DOMContentLoaded', () => {
    // Get the container element that holds JSON data as attributes
    const dataContainer = document.getElementById('data-container')
    // Parse the JSON data from the data attributes into JavaScript arrays
    const studiedDays = JSON.parse(dataContainer.getAttribute('data-studied-days'))
    const streakDays = JSON.parse(dataContainer.getAttribute('data-streak-days'))
    // addClass adds a CSS class to elements with matching IDs that match the date provided
    function addClass(dates, className) {
        for (let i = 0; i < dates.length; i++) {
            let element = document.getElementById(dates[i])
            if (element) {
                element.classList.add(className)
            }
        }
    }
    addClass(studiedDays, 'studied')
    addClass(streakDays, 'streak')
});