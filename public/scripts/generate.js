/* Upload Study Material Animation */
document.addEventListener('DOMContentLoaded', function () {
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

const imageTab = document.querySelector("#image-tab")
imageTab.addEventListener('click', (e) => {
    const submitMaterialsBtn = document.querySelector("#enterTextButton")
    submitMaterialsBtn.setAttribute("data-bs-target", '#imageModal')
})

const photoTab = document.querySelector("#photo-tab")
photoTab.addEventListener('click', (e) => {
    const submitMaterialsBtn = document.querySelector("#enterTextButton")
    submitMaterialsBtn.setAttribute("data-bs-target", '#photoModal')
})

const textTab = document.querySelector("#text-tab").addEventListener('click', (e) => {
    const submitMaterialsBtn = document.querySelector("#enterTextButton")
    submitMaterialsBtn.setAttribute("data-bs-target", "#textModal")
})

document.querySelector('#enterTextButton').addEventListener('click', (e) => {
    const uploadMaterialButton = document.querySelector('#enterTextButton')

    if (uploadMaterialButton.getAttribute('data-bs-target') === '#photoModal') {
        getCamera()
    }
})

const snap = document.querySelector("#snap")
snap.addEventListener('click', (e) => {
    takePhoto()
    const frame = document.querySelector("#frame")
    const video = document.querySelector("#cam")
    const retake = document.querySelector("#retake")
    const snapBtn = document.querySelector("#snap")
    frame.classList.toggle('hidden')
    video.classList.toggle('hidden')
    retake.classList.toggle('hidden')
    snapBtn.classList.toggle('hidden')

    turnOffCamera()
})

document.querySelector('#retake').addEventListener('click', (e) => {
    getCamera()
})

let mediaStream = null

async function getCamera() {
    const frame = document.querySelector("#frame")
    const video = document.querySelector("#cam")
    const retake = document.querySelector("#retake")
    const snapBtn = document.querySelector("#snap")
    const photoModal = document.getElementById("photoModal")

    if (!document.querySelector('#frame').classList.contains('hidden')) {
        frame.classList.toggle('hidden')
        video.classList.toggle('hidden')
        retake.classList.toggle('hidden')
        snapBtn.classList.toggle('hidden')
    }

    if (isLandscape()) {
        video.style.height = '540px'
        video.style.width = '960px'
        frame.style.height = '540px'
        frame.style.width = '960px'
        photoModal.style.setProperty("--bs-modal-width", '100%')
    }
    const generatePhotoButton = document.getElementById("generatePhotoButton")
    generatePhotoButton.disabled = true


    try {
        mediaStream = await navigator.mediaDevices.getUserMedia({
            audio: false,
            video: {
                width: { ideal: 1920 },
                height: { ideal: 1080 },
                facingMode: "environment"
            }
        })
        let video = document.getElementById('cam')
        video.srcObject = mediaStream
        video.onloadedmetadata = (event) => { video.play() }
    } catch (err) {
        console.log(err)
    }
}

async function turnOffCamera() {
    if (mediaStream) {
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
    context.drawImage(video, 0, 0, photoWidth, photoHeight)
    const image = canvas.toDataURL('image/png')
    sessionStorage.setItem('imageURL', JSON.stringify(image))
    photoFrame.setAttribute('src', image)

    canvas.width = photoWidth
    canvas.height = photoHeight

    const generatePhotoButton = document.getElementById("generatePhotoButton")
    generatePhotoButton.disabled = false
}

//Attach eventListener for 'generate' button of photoModal
document.querySelector("#generatePhotoButton").addEventListener('click', async (e) => {
    const photo = JSON.parse(sessionStorage.getItem('imageURL'))
    try {
        const loader = document.querySelector('.loading-state')
        loader.style.visibility = 'visible'
        const response = await fetch('/upload-image', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                image: photo,
                difficulty: document.getElementById("selectDifficulty").value,
                numQuestions: document.getElementById("selectNumber").value
            })
        })
        if (response.ok) {
            const data = await response.json()
            window.location.href = `/check?data=${encodeURIComponent(data)}`
        }
    } catch (err) {
        console.log(err) //implement some sort of alert that warns the user that it failed
    }
})

const targetNode = document.querySelector('#photoModal')
const config = { attributes: true, attributeFilter: ['class'] }

const callback = (mutationsList, observer) => {
    for (let mutation of mutationsList) {
        const classList = mutation.target.classList
        if (!classList.contains('show')) {
            turnOffCamera()
        }
    }
}

const observer = new MutationObserver(callback)
observer.observe(targetNode, config)

function isLandscape() {
    return screen.width > screen.height
}

/* ---------

Image File upload 

-------- */
const dropArea = document.querySelector('.drag-area');
const dragText = document.querySelector('.header');
let button = dropArea.querySelector('.button');
let input = dropArea.querySelector('input');
let file;

// when file is inside drag area
dropArea.addEventListener('dragover', (event) => {
    event.preventDefault();
    dropArea.classList.add('active');
    dragText.textContent = 'Release to Upload';
    // console.log('File is inside the drag area');
});

// when file leave the drag area
dropArea.addEventListener('dragleave', () => {
    dropArea.classList.remove('active');
    // console.log('File left the drag area');
    dragText.textContent = 'Drag & Drop';
});

// when file is dropped
dropArea.addEventListener('drop', (event) => {
    event.preventDefault();

    file = event.dataTransfer.files[0]; // grab single file even of user selects multiple files
    displayFile();
});

function displayFile() {
    let fileType = file.type;
    let validExtensions = ['image/jpeg', 'image/jpg', 'image/png', 'image/heic', 'image/heif'];
    if (validExtensions.includes(fileType)) {
        // console.log('This is an image file');
        let fileReader = new FileReader();
        fileReader.onload = async () => {
            let fileURL = fileReader.result;
            if (fileType === 'image/heic' || fileType === 'image/heif') {
                try {
                    let blob = await heic2any({ blob: file, toType: 'image/jpeg', quality: 0.5 });
                    fileURL = URL.createObjectURL(blob);
                } catch (error) {
                    console.error('Error converting HEIC to JPEG:', error);
                    alert('Error converting HEIC to JPEG');
                    dropArea.classList.remove('active');
                    return;
                }
            }
            let imgTag = `<img src="${fileURL}" alt="">`;
            dropArea.innerHTML = imgTag;
            document.getElementById('preview-message').style.visibility = "visible";
            document.getElementById('image-modal-footer').style.visibility = "visible";
        };
        fileReader.readAsDataURL(file);
    } else {
        alert('This is not an Image File');
        dropArea.classList.remove('active');
    }
}

button.onclick = () => {
    input.click();
};

// when browse
input.addEventListener('change', function () {
    file = this.files[0];
    dropArea.classList.add('active');
    displayFile();
});

document.getElementById('reset-image').addEventListener('click', () => {
    dropArea.classList.remove('active');
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
    button = dropArea.querySelector('.button');
    input = dropArea.querySelector('input');

    button.onclick = () => {
        input.click();
    };

    input.addEventListener('change', function () {
        file = this.files[0];
        dropArea.classList.add('active');
        displayFile();
    });
})

async function convertFileToBase64(file) {
    if (!file) {
        console.log("Please select an image of study material first.");
    }

    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            const base64Output = e.target.result.split(",")[1];
            resolve(base64Output);
        };
        reader.onerror = (e) => {
            console.log("Error reading the image file");
            reject(e);
        };
        reader.readAsDataURL(file);
    });
}

function sendImageApiRequest() {
    const generateBtn = document.getElementById('image-generate-button');
    generateBtn.addEventListener('click', async () => {
        const base64Output = await convertFileToBase64(file);
        const loader = document.querySelector('.loading-state')
        loader.style.visibility = 'visible'
        console.log('Start calling API')
        axios
            .post(
                "/api/generatebyimage",
                {
                    base64Input: base64Output,
                    difficulty: document.getElementById('selectDifficulty').value,
                    numQuestions: document.getElementById('selectNumber').value,
                },
                {
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            )
            .then((response) => {
                window.location.href = response.data
                console.log('Finish calling API. ')
            })
            .catch((error) => {
                console.error("There was an error!", error);
            });
    })
}
sendImageApiRequest();


