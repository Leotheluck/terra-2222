const soundButtonOn = document.querySelector('.fa-volume-up') // the variable that contains the fa volume up <i>
const soundButtonOff = document.querySelector('.fa-volume-mute') // the variable that contains the fa volume mute <i>

soundButtonOn.addEventListener('click', () => { // function to listen if the button is clicked
    soundButtonOn.style.display = "none"
    soundButtonOff.style.display ="block"
})
soundButtonOff.addEventListener('click', () =>{ // same but in the opposite way
    soundButtonOff.style.display = "none"
    soundButtonOn.style.display = "block"
})