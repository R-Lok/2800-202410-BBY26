const eggPic = document.getElementById('eggPic')
const studyGen = document.getElementById('studyGen')
const spans = document.getElementsByTagName('span')

// Onclick event listener for modifying Easter Egg elements' css classes
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

// Sets Click EventListener for names of each team member to open their github pages on a new window
function setGitHubLinks() {
    const names = document.getElementsByClassName('fw-bold')

    for (let i = 0; i < names.length; i++) {
        names[i].addEventListener('click', (e) => {
            const link = e.target.getAttribute('data-link')
            if (link) {
                confirm('Are you sure you want to leave StudyGen?') ? window.open(`https://github.com/${link}`, '_blank').focus() : ''
            }
        })
    }
}

setGitHubLinks()


// Javascript for Easter Egg background confetti animation (all code + comments below this) - copied from Jonathan Bell at codepen.io
// https://codepen.io/jonathanbell/pen/OvYVYw
let W = window.innerWidth
let H = window.innerHeight
const canvas = document.getElementById('canvas')
const context = canvas.getContext('2d')
const maxConfettis = 50
const particles = []

const possibleColors = [
    'DodgerBlue',
    'OliveDrab',
    'Gold',
    'Pink',
    'SlateBlue',
    'LightBlue',
    'Gold',
    'Violet',
    'PaleGreen',
    'SteelBlue',
    'SandyBrown',
    'Chocolate',
    'Crimson',
]

function randomFromTo(from, to) {
    return Math.floor(Math.random() * (to - from + 1) + from)
}

function confettiParticle() {
    this.x = Math.random() * W // x
    this.y = Math.random() * H - H // y
    this.r = randomFromTo(11, 33) // radius
    this.d = Math.random() * maxConfettis + 11
    this.color =
    possibleColors[Math.floor(Math.random() * possibleColors.length)]
    this.tilt = Math.floor(Math.random() * 33) - 11
    this.tiltAngleIncremental = Math.random() * 0.07 + 0.05
    this.tiltAngle = 0

    this.draw = function() {
        context.beginPath()
        context.lineWidth = this.r / 2
        context.strokeStyle = this.color
        context.moveTo(this.x + this.tilt + this.r / 3, this.y)
        context.lineTo(this.x + this.tilt, this.y + this.tilt + this.r / 5)
        return context.stroke()
    }
}

function Draw() {
    const results = []

    // Magical recursive functional love
    requestAnimationFrame(Draw)

    context.clearRect(0, 0, W, window.innerHeight)

    for (var i = 0; i < maxConfettis; i++) {
        results.push(particles[i].draw())
    }

    let particle = {}
    let remainingFlakes = 0
    for (var i = 0; i < maxConfettis; i++) {
        particle = particles[i]

        particle.tiltAngle += particle.tiltAngleIncremental
        particle.y += (Math.cos(particle.d) + 3 + particle.r / 2) / 8
        particle.tilt = Math.sin(particle.tiltAngle - i / 3) * 15

        if (particle.y <= H) remainingFlakes++

        // If a confetti has fluttered out of view,
        // bring it back to above the viewport and let if re-fall.
        if (particle.x > W + 30 || particle.x < -30 || particle.y > H) {
            particle.x = Math.random() * W
            particle.y = -30
            particle.tilt = Math.floor(Math.random() * 10) - 20
        }
    }

    return results
}

window.addEventListener(
    'resize',
    function() {
        W = window.innerWidth
        H = window.innerHeight
        canvas.width = window.innerWidth
        canvas.height = window.innerHeight
    },
    false,
)

// Push new confetti objects to `particles[]`
for (let i = 0; i < maxConfettis; i++) {
    particles.push(new confettiParticle())
}

// Initialize
canvas.width = W
canvas.height = H
Draw()
