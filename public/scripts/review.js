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

const captions = document.querySelectorAll(".carousel-caption")
console.log(captions)
document.querySelector(".carousel-control-next").addEventListener("click", incrementCounter)
document.querySelector(".carousel-control-prev").addEventListener("click", decrementCounter)

//make each flashcard flippable
captions.forEach(element => {
    element.addEventListener("click", (e) => {
        console.log("flip")
        const target = e.target.tagName == "H5" || "p" ? e.target.parentNode : e.target
        target.querySelector("p").classList.toggle("hidden")
        target.querySelector("h5").classList.toggle("hidden")
    })
})