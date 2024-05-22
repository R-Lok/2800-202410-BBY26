document.getElementById('sortCollection').addEventListener('change', async function(e) {
    const selectedOption = e.target.value;
    try {
        const response = await fetch(`/collection/sortCollection`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ selectedOption }),
        })

        let collections = await response.json();

        if (response.ok) {
            collections = collections.collections
            let htmlString = ''

            let collectionsList = document.getElementById("collectionsList");
            for(let i = 0; i < collections.length; i++) {
                htmlString += `<div class="list-group-item d-flex list-group-item-action w-100">
                <a href="/review/${collections[i].shareId}" class="p-0 m-0 flex-grow-1 setText">${collections[i].setName}</a>
                <button class="btn btn-danger" onclick="confirm('Are you sure you want to delete this set?') ? location.href ='/collection/delete/` + collections[i].shareId + `' : event.preventDefault()">Delete</button>
                </div>`
            }
            
            collectionsList.innerHTML = htmlString;

            
            
        }
    } catch (error) {
        console.log(error)
    }
})
