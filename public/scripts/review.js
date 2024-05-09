console.log("review.js loaded")


//below functions: need to set a delay that prevents the counter incrementing faster than the cards swap.

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

document.querySelectorAll(".carousel-item").forEach(ele => ele.addEventListener("transitionend", (e) => {
    const activeCard = document.querySelector(".carousel-item-next") ? document.querySelector(".carousel-item-next") : document.querySelector(".carousel-item-prev")
    console.log(activeCard)
    const counter = document.getElementById("counter")

    if(activeCard) {
        counter.textContent = activeCard.getAttribute("number")
    }
}))

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

