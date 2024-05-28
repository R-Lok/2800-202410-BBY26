const canvas = document.getElementById('lottieCanvas')
const context = canvas.getContext('2d')

lottie.loadAnimation({
    container: canvas, // the canvas element
    renderer: 'canvas', // use 'canvas' to render on canvas
    loop: false, // whether to loop the animation
    autoplay: true, // whether to start the animation immediately
    animationData: animationData, // the JSON data
    rendererSettings: {
        context: context, // the 2d context of the canvas
        scaleMode: 'noScale',
        clearCanvas: true,
        progressiveLoad: false,
        hideOnTransparent: true,
    },
})
