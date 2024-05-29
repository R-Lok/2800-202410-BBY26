let picChoice = 1

// Post fetch request function for user's changing password
const changePwd = async (securityAns, currentPwd, newPwd, confirmPwd) => {
    console.log(securityAns, currentPwd, newPwd, confirmPwd)
    try {
        const response = await fetch(`/settings/changePwd`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                securityAns, currentPwd, newPwd, confirmPwd,
            }),
        })
        const responseData = await response.json()

        if (response.ok) {
            document.getElementById('closeChangePwd').click()
            alert('Password successfully changed')
            location.reload()
            return
        } else {
            const errorMessage = responseData.message || 'Password change failed'
            alert(`${errorMessage}`)
            const submitButton = document.getElementById('submitPass')
            submitButton.disabled = false
        }
    } catch (error) {
        console.error('Error:', error)
        alert('An unexpected error occured. Please try again later')
    }
}

// Post fetch request function for user's editing name
const editName = async (newName) => {
    try {
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
        const responseData = await response.json()

        if (response.ok) {
            document.getElementById('closeEditName').click()
            alert('Display Name successfully changed')
            location.reload()
            return
        } else {
            const errorMessage = responseData.message || 'Name change failed'
            alert(`${errorMessage}`)
            const submitButton = document.getElementById('submitName')
            submitButton.disabled = false
        }
    } catch (error) {
        console.error('Error:', error)
        alert('An unexpected error occured. Please try again later')
    }
}

// Post fetch request function for editing user's Login Id
const editLoginId = async (loginId) => {
    try {
        const response = await fetch(`/settings/editLoginId`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                loginId: loginId,
            }),
        })
        const responseData = await response.json()

        if (response.ok) {
            document.getElementById('closeLoginId').click()
            alert('Login Id successfully changed')
            location.reload()
            return
        } else {
            const errorMessage = responseData.message || 'Login Id change failed'
            alert(`${errorMessage}`)
            const submitButton = document.getElementById('submitLogin')
            submitButton.disabled = false
        }
    } catch (error) {
        console.error('Error:', error)
        alert('An unexpected error occured. Please try again later')
    }
}

// Post fetch request for editing user's email
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
            const errorMessage = responseData.message || 'Email change failed'
            alert(`${errorMessage}`)
            const submitButton = document.getElementById('submitEmail')
            submitButton.disabled = false
        }
    } catch (error) {
        console.error('Error:', error)
        alert('An unexpected error occured. Please try again later')
    }
}

// Function to highlight icon when user selects between preset profile pictures
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

// Function to save the selected profile picture
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
