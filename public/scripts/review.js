console.log("review.js loaded")


//below functions: need to set a delay that prevents the counter incrementing faster than the cards swap.
function incrementCounter() {
    const numCards = Number(document.getElementById("numCards").textContent)
    const counterElem = document.getElementById("counter")

    if (Number(counterElem.textContent) >= numCards) {
        counter.textContent = 1
    } else {
        counter.textContent = Number(counter.textContent) + 1
    }
}

function decrementCounter() {
    const numCards = Number(document.getElementById("numCards").textContent)
    const counterElem = document.getElementById("counter")

    if (Number(counterElem.textContent) <= 1) {
        counter.textContent = numCards
    } else {
        counter.textContent = Number(counter.textContent) - 1
    }
}

function resetCards(e) {
        const flippedCaption = document.querySelector(".carousel-caption[flipped]")

        if(flippedCaption) {
            flippedCaption.removeAttribute("flipped")
            flippedCaption.childNodes.forEach(child => {
                if(child.nodeType == 1) {
                    child.classList.toggle("hidden")
                }
            })
        }
}

const captions = document.querySelectorAll(".carousel-caption")
console.log(captions)

document.querySelector(".carousel-control-next").addEventListener("click", incrementCounter)
document.querySelector(".carousel-control-prev").addEventListener("click", decrementCounter)
document.querySelector(".carousel-control-next").addEventListener("click", resetCards)

//make each flashcard flippable
captions.forEach(element => {
    element.addEventListener("click", (e) => {
        console.log("flip")
        const target = e.target.tagName == "H5" || e.target.tagName == "P" ? e.target.parentNode : e.target
        console.log(target)
        const answer = target.querySelector('p')
        const prompt = target.querySelector("h5")

        answer.classList.toggle("hidden")
        prompt.classList.toggle("hidden")

        if (prompt.classList.contains("hidden")) {
            target.setAttribute("flipped", "")
        } else {
            target.removeAttribute("flipped")
        }
    })
})

