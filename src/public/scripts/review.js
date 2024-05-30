console.log('review.js loaded')

// this function is used to "unflip" a flashcard, so the question side is showing
// when they go back to it in the same review session.
function resetCards(e) {
    const flippedCaption = document.querySelector('.carousel-caption[flipped]')

    if (flippedCaption) {
        flippedCaption.removeAttribute('flipped')
        flippedCaption.childNodes.forEach((child) => {
            if (child.nodeType == 1) {
                child.classList.toggle('hidden')
            }
        })
    }
}

// This adds event listeners to each flashcard that updates the counter at the top according to which flashcard is currently being displayed
document.querySelectorAll('.carousel-item').forEach((ele) => ele.addEventListener('transitionend', (e) => {
    const activeCard = document.querySelector('.carousel-item-next') ? document.querySelector('.carousel-item-next') : document.querySelector('.carousel-item-prev')
    console.log(activeCard)
    const counter = document.getElementById('counter')

    if (activeCard) {
        counter.textContent = activeCard.getAttribute('number')
    }
}))

// these event listeners are applied to the 'next' and 'previous' arrows of the page, to
// reset the card to the question face when the user moves to the previous or next card
document.querySelector('.carousel-control-next').addEventListener('click', resetCards)
document.querySelector('.carousel-control-prev').addEventListener('click', resetCards)

// This forEach call makes it so each flashcard is "flippable". When the user clicks/taps the flashcard,
// it will "flip" to the other side
const captions = document.querySelectorAll('.carousel-caption')
captions.forEach((element) => {
    element.addEventListener('click', (e) => {
        console.log('flip')
        const target = e.target.tagName === 'H5' || e.target.tagName === 'P' ? e.target.parentNode : e.target
        console.log(target)
        const answer = target.querySelector('p')
        const prompt = target.querySelector('h5')

        answer.classList.toggle('hidden')
        prompt.classList.toggle('hidden')

        if (prompt.classList.contains('hidden')) {
            target.setAttribute('flipped', '')
        } else {
            target.removeAttribute('flipped')
        }
    })
})

// this function is used for triggering the "Sharecode copied to clipboard" message when the
// user taps or clicks on the sharecode
function triggerCopyAlert(e) {
    navigator.clipboard.writeText(e.target.textContent)

    const alert = document.querySelector('.alert')
    clearAlertClasses(alert)
    alert.classList.add('alert-success')
    alert.textContent = 'Sharecode copied to clipboard!'
    alert.classList.remove('alert-hidden')
    setTimeout(() => {
        alert.classList.add('alert-hidden')
    }, 3000)
}

// this function is used to alert the user of an error when the app fails to reach the server,
// or if the write to database failed.
function triggerDBFailAlert(text) {
    const alert = document.querySelector('.alert')
    clearAlertClasses(alert)
    alert.classList.add('alert-warning')
    alert.textContent = text
    alert.classList.remove('alert-hidden')
    setTimeout(() => {
        alert.classList.add('alert-hidden')
    }, 3000)
}

// This function clears all alert classes from the alert element (removes the color)
function clearAlertClasses(element) {
    element.classList.remove('alert-success')
    element.classList.remove('alert-warning')
}

// only attach these eventListeners if the element exists (only exists when "viewing")
if (document.getElementById('sharecode')) {
    document.getElementById('sharecode').addEventListener('touchstart', triggerCopyAlert)
    document.getElementById('sharecode').addEventListener('click', triggerCopyAlert)
}

// Attach eventListener to the "save" button if it exists on the page (only when "finalizing" the set)
// this needs validation in the backend to prevent injections
if (document.getElementById('save-button')) {
    document.getElementById('save-button').addEventListener('click', async (e) => {
        if(!document.getElementById('setName').value.trim().length) {
            return triggerDBFailAlert('Please enter a flashcard set name!')
        }

        e.target.disabled = true
        const data = {
            name: document.getElementById('setName').value.trim(),
            cards: localStorage.getItem('cards') }
        console.log('data:' + data)

        try {
            const response = await fetch('/submitcards', {
                method: 'POST',
                body: JSON.stringify(data),
                headers: { 'Content-Type': 'application/json' },
            })
            if (response.ok) {
                const data = await response.json()
                window.location.href = `/review/${JSON.parse(data).shareId}`
            } else {
                const text = await response.json()
                triggerDBFailAlert(text.message)
                e.target.disabled = false
            }
        } catch {
            console.log('Error in submission')
            triggerDBFailAlert('An unexpected error occurred. Please try again later.')
        }
    },
    )
}

