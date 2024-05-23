const eggPic = document.getElementById('eggPic')
const studyGen = document.getElementById('studyGen')
const spans = document.getElementsByTagName('span')

eggPic.addEventListener('click', () => {
    if (eggPic.src.includes('/images/depresso2.gif')) {
        location.reload()
    } else {
        eggPic.src = '/images/depresso2.gif'
        studyGen.classList.remove('eggText')
        studyGen.classList.add('eggText2')

        for (let i = 0; i < spans.length; i++) {
            if ((i % 2) === 0) {
                spans[i].classList.add('nameCard3')
            } else {
                spans[i].classList.add('nameCard2')
            }
            spans[i].classList.remove('nameCard')
            spans[i].classList.remove('name' + i)
        }
    }
})
