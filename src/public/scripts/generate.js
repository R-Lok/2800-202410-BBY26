// Add Upload Study Material Animation
function addLoadingEvent() {
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
}
addLoadingEvent()

// Add event listener to generate button to fetch parameters to our API call endpoint
function sendApiRequest() {
    const generateBtn = document.getElementById('generateButton')

    generateBtn.addEventListener('click', async () => {
        const flashcardDetails = {
            difficulty: document.getElementById('selectDifficulty').value,
            numQuestions: document.getElementById('selectNumber').value,
            material: document.getElementById('material').value,
        }
        const url = '/generate/bytext'
        try {
            const loader = document.querySelector('.loading-state')
            loader.style.visibility = 'visible'
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(flashcardDetails),
            })
            // Check if the response is successful
            if (!response.ok) {
                loader.style.visibility = 'hidden'
                const data = await response.json()
                displayAlert(data.msg)
                return
            }
            // Parse the JSON response
            window.location.href = response.url
        } catch (error) {
            console.error('Error:', error)
        }
    })
}
sendApiRequest()

// sets the target for "upload study material" button to imageModal
// if the upload image tab is pressed
const imageTab = document.querySelector('#image-tab')
imageTab.addEventListener('click', (e) => {
    const submitMaterialsBtn = document.querySelector('#enterTextButton')
    submitMaterialsBtn.setAttribute('data-bs-target', '#imageModal')
})

// sets the target for "upload study material" button to photo capture modal
// if the 'take photo' tab is pressed
const photoTab = document.querySelector('#photo-tab')
photoTab.addEventListener('click', (e) => {
    const submitMaterialsBtn = document.querySelector('#enterTextButton')
    submitMaterialsBtn.setAttribute('data-bs-target', '#photoModal')
})

// sets the target for "upload study material" button to text upload modal
// if the 'text upload' tab is pressed
const textTab = document.querySelector('#text-tab').addEventListener('click', (e) => {
    const submitMaterialsBtn = document.querySelector('#enterTextButton')
    submitMaterialsBtn.setAttribute('data-bs-target', '#textModal')
})

// Turns on the camera if the bs-target for the upload study button is #photoModal,
// and it is pressed (so camera is on as soon as the modal opens)
document.querySelector('#enterTextButton').addEventListener('click', (e) => {
    const uploadMaterialButton = document.querySelector('#enterTextButton')

    if (uploadMaterialButton.getAttribute('data-bs-target') === '#photoModal') {
        getCamera()
    }
})

// EventListener for 'take photo' button that hides/shows relevant elements when
// a photo is taken
const snap = document.querySelector('#snap')
snap.addEventListener('click', (e) => {
    takePhoto()
    const frame = document.querySelector('#frame')
    const video = document.querySelector('#cam')
    const retake = document.querySelector('#retake')
    const snapBtn = document.querySelector('#snap')
    frame.classList.toggle('hidden')
    video.classList.toggle('hidden')
    retake.classList.toggle('hidden')
    snapBtn.classList.toggle('hidden')

    turnOffCamera()
})

// Turns on the camera and show relevant elements when the 'retake' button is pressed
document.querySelector('#retake').addEventListener('click', (e) => {
    getCamera()
})

// mediaStream reference variable needed for video/camera
let mediaStream = null

// turns on the camera and feeds the stream to the video element
async function getCamera() {
    const frame = document.querySelector('#frame')
    const video = document.querySelector('#cam')
    const retake = document.querySelector('#retake')
    const snapBtn = document.querySelector('#snap')
    const photoModal = document.getElementById('photoModal')

    if (!document.querySelector('#frame').classList.contains('hidden')) {
        [frame, video, retake, snapBtn].forEach((elem) => toggleHidden(elem))
    }

    if (isLandscape()) {
        video.style.height = '540px'
        video.style.width = '960px'
        frame.style.height = '540px'
        frame.style.width = '960px'
        photoModal.style.setProperty('--bs-modal-width', '100%')
    }
    const generatePhotoButton = document.getElementById('generatePhotoButton')
    generatePhotoButton.disabled = true
    connectToCamera()
}

// This function toggles the hidden class on the input element (invisible and does not take up dom space)
function toggleHidden(element) {
    element.classList.toggle('hidden')
}

//This function toggles the invisible class on the input element (invisible, but takes up dom space)
function toggleOpacity(element) {
    element.classList.toggle('invisible')
}

// This function assigns the user's device camera to the mediaStream reference
// and sets the source for the video to the mediaStream (user's camera)
async function connectToCamera() {
    try {
        mediaStream = await navigator.mediaDevices.getUserMedia({
            audio: false,
            video: {
                width: { ideal: 1920 },
                height: { ideal: 1080 },
                facingMode: 'environment',
            },
        })
        const video = document.getElementById('cam')
        video.srcObject = mediaStream
        video.onloadedmetadata = (event) => {
            video.play()
        }
    } catch (err) {
        console.log(err)
    }
}

// turns off the camera
async function turnOffCamera() {
    if (mediaStream) {
        const tracks = mediaStream.getTracks()
        tracks.forEach((track) => track.stop())

        const video = document.getElementById('cam')
        video.srcObject = null
    }
}

// takes a snapshot of what the user's device camera is currently seeing (what is in the video element right now)
function takePhoto() {
    const photoFrame = document.querySelector('#frame')
    const video = document.querySelector('#cam')
    const canvas = document.querySelector('#canv')
    const context = canvas.getContext('2d')

    canvas.width = video.videoWidth
    canvas.height = video.videoHeight

    const photoHeight = video.videoHeight
    const photoWidth = video.videoWidth
    context.drawImage(video, 0, 0, photoWidth, photoHeight)
    const image = canvas.toDataURL('image/png')
    photoFrame.setAttribute('src', image)

    canvas.width = photoWidth
    canvas.height = photoHeight

    const generatePhotoButton = document.getElementById('generatePhotoButton')
    generatePhotoButton.disabled = false
}

// Attach eventListener for 'generate' button of photoModal
// sends a request to the server to generate flashcards based on the photo taken
document
    .querySelector('#generatePhotoButton')
    .addEventListener('click', async (e) => {
        const photo = document.getElementById("frame").src
        try {
            const loader = document.querySelector('.loading-state')
            loader.style.visibility = 'visible'
            const response = await fetch('/generate/byphotoupload', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    image: photo,
                    difficulty: document.getElementById('selectDifficulty').value,
                    numQuestions: document.getElementById('selectNumber').value,
                }),
            })
            if (response.ok) {
                const data = await response.json()
                console.log(data)
                window.location.href = `/check?data=${(encodeURIComponent(data))}`
            } else {
                
                const data = await response.json()
                displayAlert(data.msg)
            }
        } catch (err) {
            console.log(err) // implement some sort of alert that warns the user that it failed
            loader.style.visibility = 'hidden'
        }
    })

//Displays the msg in a pop up alert at the top of the screen (used for error messages)
function displayAlert(msg) {
    const alert = document.getElementById("alert")
    toggleOpacity(alert)
    alert.textContent = msg
    setTimeout(() => {
        toggleOpacity(alert)
    }, 3000)
}
// mutationObserver to look at the photoModal for changes
// if the classList of photoModal doesn't have 'show', turn off the camera
const targetNode = document.querySelector('#photoModal')
const config = { attributes: true, attributeFilter: ['class'] }

const callback = (mutationsList, observer) => {
    for (const mutation of mutationsList) {
        const classList = mutation.target.classList
        if (!classList.contains('show')) {
            turnOffCamera()
        }
    }
}

const observer = new MutationObserver(callback)
observer.observe(targetNode, config)


// Checks if the user device is landscape or portrait
function isLandscape() {
    return screen.width > screen.height
}

/* ---------

Image File upload

-------- */
const dropArea = document.querySelector('.drag-area')
const dragText = document.querySelector('.header')
const button = dropArea.querySelector('.button')
const input = dropArea.querySelector('input')
let file

// Add dragover, dragleave, and drag events for users dragging the image to upload area
function addDragEvents() {
    // when file is inside drag area
    dropArea.addEventListener('dragover', (event) => {
        event.preventDefault()
        dropArea.classList.add('active')
        dragText.textContent = 'Release to Upload'
        // console.log('File is inside the drag area');
    })

    // when file leave the drag area
    dropArea.addEventListener('dragleave', () => {
        dropArea.classList.remove('active')
        // console.log('File left the drag area');
        dragText.textContent = 'Drag & Drop'
    })

    // when file is dropped
    dropArea.addEventListener('drop', (event) => {
        event.preventDefault()

        file = event.dataTransfer.files[0] // grab single file even of user selects multiple files
        displayFile()
    })
}
addDragEvents()


// Display the image upload in the middle of modal
function displayFile() {
    const fileType = file.type
    const validExtensions = [
        'image/jpeg',
        'image/jpg',
        'image/png',
        'image/heic',
        'image/heif',
    ]
    if (validExtensions.includes(fileType)) {
        // console.log('This is an image file');
        const fileReader = new FileReader()
        fileReader.onload = async () => {
            let fileURL = fileReader.result
            if (fileType === 'image/heic' || fileType === 'image/heif') {
                try {
                    const blob = await heic2any({
                        blob: file,
                        toType: 'image/jpeg',
                        quality: 0.5,
                    })
                    fileURL = URL.createObjectURL(blob)
                } catch (error) {
                    console.error('Error converting HEIC to JPEG:', error)
                    alert('Error converting HEIC to JPEG')
                    dropArea.classList.remove('active')
                    return
                }
            }
            const imgTag = `<img id="upload-preview" src="${fileURL}" alt="">`
            dropArea.innerHTML = imgTag
            document.getElementById('preview-message').style.visibility = 'visible'
            document.getElementById('image-modal-footer').style.visibility =
                'visible'
        }
        fileReader.readAsDataURL(file)
    } else {
        alert('This is not an Image File')
        dropArea.classList.remove('active')
    }
}

button.onclick = () => {
    input.click()
}

// Display image when users upload the image by browsing their file system
function addBrowseUploadEvent() {
    input.addEventListener('change', function() {
        file = this.files[0]
        dropArea.classList.add('active')
        displayFile()
    })
}
addBrowseUploadEvent()

// Add image reset event
function addResetImageEvent(dropArea, button, input, file) {
    document.getElementById('reset-image').addEventListener('click', () => {
        dropArea.classList.remove('active')
        dropArea.innerHTML = `
        <div class="icon">
            <i class="fas fa-images"></i>
        </div>
        <span class="header">Drag & Drop</span>
        <span class="header">or <span class="button">browse</span></span>
        <input type="file" hidden />
        <span class="support">Supports: JPEG, JPG, PNG, HEIC, HEIF</span>
        `
        // Reattach event listeners after resetting the drop area content
        button = dropArea.querySelector('.button')
        input = dropArea.querySelector('input')

        button.onclick = () => {
            input.click()
        }

        input.addEventListener('change', function() {
            file = this.files[0]
            dropArea.classList.add('active')
            displayFile()
        })
    })
}
addResetImageEvent(dropArea, button, input, file)

/**
 * Convert blob into base64 string
 * @param {object} file - The length of the rectangle
 * @return {Promise} promise - Promise that resolves to a base64 file in string representation
 */
async function convertFileToBase64(file) {
    if (!file) {
        console.log('Please select an image of study material first.')
    }

    return new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.onload = (e) => {
            const base64Output = e.target.result.split(',')[1]
            resolve(base64Output)
        }
        reader.onerror = (e) => {
            console.log('Error reading the image file')
            reject(e)
        }
        reader.readAsDataURL(file)
    })
}

/**
 * Convert blob into base64 object
 * @param {object} file - The length of the rectangle
 * @return {Promise} promise - Promise that resolves to a base64 file in string representation
 */
function sendImageApiRequest() {
    const generateBtn = document.getElementById('image-generate-button')
    generateBtn.addEventListener('click', async () => {
        const base64Output = await convertFileToBase64(file)
        const loader = document.querySelector('.loading-state')
        loader.style.visibility = 'visible'
        console.log('Start calling API')
        axios
            .post(
                '/generate/byimage',
                {
                    base64Input: base64Output,
                    difficulty: document.getElementById('selectDifficulty').value,
                    numQuestions: document.getElementById('selectNumber').value,
                },
                {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                },
            )
            .then((response) => {
                console.log(response)
                window.location.href = response.data
                console.log('Finish calling API. ')
            })
            .catch((error) => {
                loader.style.visibility = 'hidden'
                displayAlert(error.response.data.msg)
            })
    })
}
sendImageApiRequest()

//Disable the generate button for the text modal if the textarea element is empty
//enable if the textarea contains a value (text)
document.getElementById("material").addEventListener("input", (e) => {
    const generateBtn = document.getElementById("generateButton")

    if(e.target.value === '') {
        generateBtn.disabled = true
    } else {
        generateBtn.disabled = false
    }
})