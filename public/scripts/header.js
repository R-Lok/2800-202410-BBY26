async function fetchHeaderImage() {
    try {
        const response = await fetch('/api/getUserImage');
        if(!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        return data.imagePath;
    } catch (error) {
        console.error('Problem with fetch operation:', error);
        return '/images/ProfileIcon.png'
    }
}

fetchHeaderImage()
.then(imagePath => {
document.getElementById('headerProfilePic').src = imagePath;
});