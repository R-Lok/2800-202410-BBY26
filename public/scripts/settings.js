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
        }
    } catch (error) {
        console.error('Error:', error)
        alert('An unexpected error occured. Please try again later')
    }
}


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
        }
    } catch (error) {
        console.error('Error:', error)
        alert('An unexpected error occured. Please try again later')
    }
}

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
        }
    } catch (error) {
        console.error('Error:', error)
        alert('An unexpected error occured. Please try again later')
    }
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
            const errorMessage = responseData.message || 'Email change failed'
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
