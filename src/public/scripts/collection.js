// Event Listener for dropdown option selection change
document.getElementById('sortCollection').addEventListener('change', async function(e) {
    const selectedOption = e.target.value
    if (selectedOption === 'default') {
        return
    }
    try {
        // Fetch request to sortCollection post route with value of selectedOption
        const response = await fetch(`/collection/sortCollection`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ selectedOption }),
        })
        let collections = await response.json()
        if (response.ok) {
            collections = collections.collections
            let htmlString = ''
            const collectionsList = document.getElementById('collectionsList')
            // Generates new list flashcard set list html using returned sorted array from the post route
            for (let i = 0; i < collections.length; i++) {
                htmlString += `<div class="list-group-item d-flex list-group-item-action w-100">
                <a href="/review/${collections[i].shareId}" class="p-0 m-0 flex-grow-1 setText">${collections[i].setName}</a>
                <button class="btn btn-danger" onclick="confirm('Are you sure you want to delete this set?') ? 
                deleteFlashCardSet('${collections[i].shareId}') : event.preventDefault()">Delete</button></div>`
            }
            collectionsList.innerHTML = htmlString
        }
    } catch (error) {
        console.log(error)
    }
})


// Function to make a DELETE fetch request for a particular flashcard set
async function deleteFlashCardSet(shareId) {
    try {
        const response = await fetch(`/collection/delete/${shareId}`, {
            method: 'DELETE',
        })

        const result = await response.json()

        if (response.ok) {
            window.location.href = '/collection'
            alert('Flashcard Set Successfully Deleted')
        } else {
            if (response.status === 403 || response.status === 404) {
                const errorMessage = result.message || 'Failed to Delete Flashcard Set'
                alert(`${errorMessage}`)
            }
        }
    } catch (error) {
        console.log(error)
    }
}

// Function to make a DELETE fetch request for all of user's flashcard sets
async function deleteAll() {
    try {
        const response = await fetch(`/collection/deleteAll`, {
            method: 'DELETE',
        })

        const result = await response.json()

        if (response.ok) {
            window.location.href = '/collection'
            alert('All Flashcards Deleted Successfully')
        } else {
            if (response.status === 403 || response.status === 404) {
                const errorMessage = result.message || 'Failed to Delete All Flashcard Set'
                alert(`${errorMessage}`)
            }
        }
    } catch (error) {
        console.log(error)
    }
}
