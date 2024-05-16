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

let picChoice = 1;

function highlightIcon(clickedImage){
    
    //Remove 'profilePicBorder' class for all images
    for(let i = 1; i <= 9; i++) {
        let elementNum = 'image' + i;
        let element = document.getElementById(elementNum);
        element.classList.remove("profilePicBorderHighlight");
        
    }
    
    if(clickedImage) {
        clickedImage.classList.add("profilePicBorderHighlight");
    }

    let imageId = clickedImage.id;
    picChoice = imageId[5];
}


document.getElementById('SaveButton').addEventListener('click', async function() {
    try {
    const response = await fetch(`/settings/changePic`, {
        method: 'POST',
        headers: {
            'Content-Type':'application/json'
        },
        body:JSON.stringify({picture:picChoice})
    })
    if (response.ok){
        window.location.href="/settings";
    }
} catch(error) {
    console.log(error);
}
});