//export one function that detect when a key is down and return true or when a key is up => so that it's possible to use more than one key at a time
(function() {
    let pressedKeys = {}

    function setKey(event, status) {
        let code = event.keyCode
        let key

        switch(code) {
        case 32: key = 'SPACE'
        break
        case 37: key = 'LEFT'
        break
        case 38: key = 'UP'
        break
        case 39: key = 'RIGHT'
        break
        case 40: key = 'DOWN'
        break
        case 16: key = 'SHIFT'
        break
        case 13: key = 'ENTER'
        break
        case 12: key = 'ESCAPE'
        break

        default:
            // Convert ASCII codes to letters
            key = String.fromCharCode(code)
        }

        pressedKeys[key] = status
    }

    document.addEventListener('keydown', function(event) {
        setKey(event, true)
    })

    document.addEventListener('keyup', function(event) {
        setKey(event, false)
    })

    //blur is for an element has lost focus to avoid errors when the key is not press anymore
    window.addEventListener('blur', function() {
        pressedKeys = {}
    })

    window.input = {
        isDown: function(key) {
            return pressedKeys[key.toUpperCase()]
        }
    }
})()