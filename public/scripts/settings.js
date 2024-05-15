const changePwd = async (previousPwd, newPwd, ConfirmPwd) => {
    console.log(previousPwd, newPwd, ConfirmPwd)
    const response = await fetch(`/settings/changePwd`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            previousPwd, newPwd, ConfirmPwd,
        }),
    })
        .then((response) => {
            console.log(response)
            if (response.ok) {
                document.getElementById('closeChangePwd').click()
                return response.json()
            }
            throw new Error('Something went wrong')
        })
        .catch((error) => {
            console.error('Error:', error)
        })
    return response
}

const editName = async (newName) => {
    console.log(newName)
    const response = await fetch(`/settings/editName`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            newName: newName,
        }),
    })
        .then((response) => {
            console.log(response)
            if (response.ok) {
                document.getElementById('closeEditName').click()
                return response.json()
            }
            throw new Error('Something went wrong')
        })
        .catch((error) => {
            console.error('Error:', error)
        })
    return response
}

function highlightIcon(clickedImage){
    
    //Remove 'profilePicBorder' class for all images
    for(let i = 1; i <= 9; i++) {
        let elementNum = 'image' + i;
        let element = document.getElementById(elementNum);
        element.classList.remove("profilePicBorder");
        
    }
    
    if(clickedImage) {
        clickedImage.classList.add("profilePicBorder");
    }
}
