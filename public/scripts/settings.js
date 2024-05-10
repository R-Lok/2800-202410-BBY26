const changePwd = async () => {
    const previousPwd = document.getElementById('previousPwd').value
    const newPwd = document.getElementById('newPwd').value
    const ConfirmPwd = document.getElementById('ConfirmPwd').value
    // console.log(previousPwd, newPwd, ConfirmPwd)
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

const editName = async () => {
    const newName = document.getElementById('newName').value
    // console.log(newName)
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

document.getElementById('changePwdSubmit').addEventListener('click', changePwd)
document.getElementById('editNameSubmit').addEventListener('click', editName)
