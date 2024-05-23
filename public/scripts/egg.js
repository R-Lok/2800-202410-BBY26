const eggPic = document.getElementById('eggPic')
const studyGen = document.getElementById('studyGen')
const spans = document.getElementsByTagName('span')

eggPic.addEventListener('click', () => {
    if (eggPic.src.includes('/images/depresso2.gif')) {
        eggPic.src = '/images/depresso1.gif'
        studyGen.classList.add('eggText')
        studyGen.classList.remove('eggText2')
        for (let i = 1; i < spans.length; i++) {
            if ((i % 2) === 0) {
                spans[i].classList.remove('nameCard3')
            } else {
                spans[i].classList.remove('nameCard2')
            }
            spans[i].classList.add('nameCard')
            spans[i].classList.add('name' + i)
        }
    } else {
        eggPic.src = '/images/depresso2.gif'
        studyGen.classList.remove('eggText')
        studyGen.classList.add('eggText2')

        for (let i = 1; i < spans.length; i++) {
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

