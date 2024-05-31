//Adding event listeners for all footer buttons to change image from unfilled to filled version
for (let i = 1; i <= 3; i++) {
    let elementId = "footerButton" + i
    const button = document.getElementById(elementId);
    let imageId = "footerImg" + i
    const image = document.getElementById(imageId)
    button.addEventListener('click', () => {
        image.src = '/images/footerImage' + i + '.svg';
    })
    button.addEventListener('mouseover', () => {
        image.src = '/images/footerImage' + i + '.svg';
    })

    button.addEventListener('mouseleave', () => {
        image.src = '/images/footer' + i + '.svg';
    })
}