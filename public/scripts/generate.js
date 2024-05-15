/* Upload Study Material Animation */
document.addEventListener('DOMContentLoaded', function() {
    const selectDifficulty = document.getElementById('selectDifficulty')
    const selectNumber = document.getElementById('selectNumber')
    const enterTextButton = document.getElementById('enterTextButton')

    function handleSelectChange() {
        if (selectDifficulty.value !== '' && selectNumber.value !== '') {
            enterTextButton.style.display = 'block' // Show the button
        } else {
            enterTextButton.style.display = 'none' // Hide the button
        }
    }

    selectDifficulty.addEventListener('change', handleSelectChange)
    selectNumber.addEventListener('change', handleSelectChange)
})

/* Add event listener to generate button to fetch parameters to our API call endpoint */
function sendApiRequest() {
    const generateBtn = document.getElementById('generateButton')

    generateBtn.addEventListener('click', async () => {
        const flashcardDetails = {
            difficulty: document.getElementById('selectDifficulty').value,
            numQuestions: document.getElementById('selectNumber').value,
            material: document.getElementById('material').value,
        }

        const url = '/api/generate'

        try {
            const loader = document.querySelector('.loading-state')
            loader.style.visibility = 'visible'
            console.log('Start calling API')
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(flashcardDetails),
            })
            // Check if the response is successful
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`)
            }
            // Parse the JSON response
            window.location.href = response.url
            console.log('Finish calling API. ')
        } catch (error) {
            console.error('Error:', error)
        }
    })
}
sendApiRequest()

const photoTab = document.querySelector("#photo-tab")
photoTab.addEventListener('click', (e) => {
    const submitMaterialsBtn = document.querySelector("#enterTextButton")
    submitMaterialsBtn.setAttribute("data-bs-target", '#photoModal')
})

const camOn = document.querySelector("#camOn")
camOn.addEventListener('click' , (e) => {
    console.log("hi")
    getCamera()
})

const camOff = document.querySelector("#camOff")
camOff.addEventListener('click', (e) => {
    turnOffCamera()
})

const snap = document.querySelector("#snap")
snap.addEventListener('click', (e) => {
    takePhoto()
})

let mediaStream = null

async function getCamera() {
    try {
        mediaStream = await navigator.mediaDevices.getUserMedia({
            audio: false,
            video: {
                width: { ideal: 350 },
                height: { ideal: 640 },
                facingMode: "environment"
            }
        })
        let video = document.getElementById('cam')
        video.srcObject = mediaStream
        video.onloadedmetadata = (event) => {video.play()}
    } catch (err) {
        console.log(err)
    }
}

async function turnOffCamera() {
    if(mediaStream) {
        let tracks = mediaStream.getTracks()
        tracks.forEach(track => track.stop())

        let video = document.getElementById('cam')
        video.srcObject = null
    }
}

function takePhoto() {
    let photoFrame = document.querySelector("#frame")
    let video = document.querySelector("#cam")
    let canvas = document.querySelector("#canv")
    let context = canvas.getContext('2d')

    canvas.width = video.videoWidth
    canvas.height = video.videoHeight

    const photoHeight = video.videoHeight
    const photoWidth = video.videoWidth
    context.drawImage(video, 0, 0, 350, 640)
    const image = canvas.toDataURL('image/png')
    photoFrame.setAttribute('src', image)

    canvas.width = photoWidth
    canvas.height = photoHeight
}