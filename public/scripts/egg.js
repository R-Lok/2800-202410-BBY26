const eggPic = document.getElementById('eggPic')
const studyGen = document.getElementById('studyGen')
const spans = document.getElementsByTagName('span')
const audio = document.getElementById('pickaxeAudio')

eggPic.addEventListener('click', () => {
    if (eggPic.src.includes('/images/depresso2.gif')) {
        location.reload()
    } else {
        eggPic.src = '/images/depresso2.gif'
        studyGen.classList.remove('eggText')
        studyGen.classList.add('eggText2')
        audio.muted = true

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

function initialPlayAudio() {
    const delay = 1650
    const delay2 = 1950

    setTimeout(() => {
        audio.play()
    }, delay)

    audio.addEventListener('ended', () => {
        setTimeout(() => {
            audio.play()
        }, delay2)
    })
}

window.onload = initialPlayAudio
