const changePwd = async (previousPwd, newPwd, confirmPwd) => {
    console.log(previousPwd, newPwd, confirmPwd)
    const response = await fetch(`/settings/changePwd`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            previousPwd, newPwd, confirmPwd,
        }),
    })
        .then(async (response) => {
            console.log(response)
            if (response.ok) {
                document.getElementById('closeChangePwd').click()
                alert('Password successfully changed')
                location.reload()
                return
            }
            throw new Error('Incorrect input')
        })
        .catch((error) => {
            document.getElementById('closeChangePwd').click()
            alert(error.message)
            return
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
                alert('Name successfully changed')
                location.reload()
                return
            }
            throw new Error('Something went wrong')
        })
        .catch((error) => {
            console.error('Error:', error)
        })
    return response
}

const editLoginId = async (loginId) => {
    console.log(loginId)
    const response = await fetch(`/settings/editLoginId`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            loginId: loginId,
        }),
    })
        .then((response) => {
            console.log(response.json())
            if (response.ok) {
                document.getElementById('closeLoginId').click()
                alert('LoginId successfully changed')
                location.reload()
                return
            }
            throw new Error('Something went wrong')
        })
        .catch((error) => {
            console.error('Error:', error)
        })
    return response
}

const editEmail = async (email) => {
    console.log(email)
    try {
        const response = await fetch(`/settings/editEmail`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email: email,
            }),
        })
        const responseData = await response.json()

        if (response.ok) {
            document.getElementById('closeEmail').click()
            alert('Email successfully changed')
            location.reload()
            return
        } else {
            const errorMessage = responseData.message || 'Email change Failed'
            alert(`${errorMessage}`)
        }
    } catch (error) {
        console.error('Error:', error)
        alert('An unexpected error occured. Please try again later')
    }
}

let picChoice = 1

function highlightIcon(clickedImage) {
    // Remove 'profilePicBorder' class for all images
    for (let i = 1; i <= 9; i++) {
        const elementNum = 'image' + i
        const element = document.getElementById(elementNum)
        element.classList.remove('profilePicBorderHighlight')
    }

    if (clickedImage) {
        clickedImage.classList.add('profilePicBorderHighlight')
    }

    const imageId = clickedImage.id
    picChoice = imageId[5]
}


document.getElementById('SaveButton').addEventListener('click', async function() {
    try {
        const response = await fetch(`/settings/changePic`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ picture: picChoice }),
        })
        if (response.ok) {
            window.location.href = '/settings'
        }
    } catch (error) {
        console.log(error)
    }
})
