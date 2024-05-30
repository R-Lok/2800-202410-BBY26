//Adding event listeners for all footer buttons to change image from unfilled to filled version
for (let i = 1; i <= 3; i++) {
    let elementId = "footerImg" + i
    const image = document.getElementById(elementId);
    image.addEventListener('click', () => {
        image.src = './images/footerImage' + i + '.svg';
    })
    image.addEventListener('mouseover', () => {
        image.src = './images/footerImage' + i + '.svg';
    })

    image.addEventListener('mouseleave', () => {
        image.src = './images/footer' + i + '.svg';
    })
}