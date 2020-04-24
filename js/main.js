window.onload = function pageReveal() {
    document.querySelector('.loader').style.visibility = 'hidden'
    document.querySelector('.toBeShown').style.visibility = 'visible'
}

const soundButton = document.querySelector('.sound-button') // the variable that contains the fa volume up <i>
const audio = new Audio('./audio/Lobby.mp3') //audio 
const clickSound = new Audio('audio/click.wav')

let isSoundOn = false

soundButton.addEventListener('click', () => { // function to listen if the button is clicked
    if (isSoundOn) {
        isSoundOn = false
        stopMusic(audio)
        document.querySelector('.sound-button').style.backgroundImage = 'url(img/sound-off.png)'
    } else {
        isSoundOn = true
        playMusic(audio, 0.6)
        document.querySelector('.sound-button').style.backgroundImage = 'url(img/sound-on.png)'
    }
})

function playMusic(x, y) {
    x.setAttribute('loop', '')
        x.volume = y
        x.play()
}

function stopMusic(x){
    x.pause()
}

function playEffect(x, y) {
    x.volume = y
        x.play()
}

// LORE PRESENTATION SECTION

const pilotPreview1 = document.querySelector('.pilotPreview1')
const pilotPreview2 = document.querySelector('.pilotPreview2')
const pilotPreview3 = document.querySelector('.pilotPreview3')

let pilotImage = document.querySelector('.pilot')

const loreTitle = document.querySelector('.loreTitle')
const loreText = document.querySelector('.loreText')

resetloreText = document.querySelector('.synopsis')

pilotPreview1.addEventListener('click', () =>
{
    playEffect(clickSound, 0.4)
    pilotImage.setAttribute('src', './img/pilot1.png')
    loreTitle.textContent = `CARLOS MARTINEZ`
    loreText.textContent = `Carlos Martinez a vécu la plupart de sa vie sur Mars, une planète autrefois aride mais désormais rendue largement vivable par la technologie humaine. Ignorant l'identité de ses parents, il a grandi en orphelinat et a toujours connu une précarité certaine, Mars étant une planète très hétérogène où riches touristes, attirés par le climat agréable, et population pauvre se cottoient. Sans grande perspective d'avenir, il a d'abord gagné sa vie en procédant à divers traffics illégaux, avant de se faire convaincre de rejoindre les Forces Terriennes de Protection par George Williamson, un agent borné des FTP chargé de la lutte contre la criminalité martienne. Très vite, Carlos se révélera être un véritable prodige et deviendra le plus jeune pilote stellaire d'élite.`
})

pilotPreview2.addEventListener('click', () =>
{
    playEffect(clickSound, 0.4)
    pilotImage.setAttribute('src', './img/pilot2.png')
    loreTitle.textContent = `KATE FISCHER`
    loreText.textContent = `Née dans une famille très riche à bord d'un vaisseau de croisière, Kate Fischer a été élevée très strictement par des parents particulièrement sévères, attendant d'elle l'excellence. Heureusement pour elle, Kate aimait apprendre et était une jeune fille brillante ; malgré tout, elle ne pouvait s'empêcher de rêver d'aventures et de liberté, le regard perdu, observant l'hyperespace à travers le hublot de sa suite spatiale. Un jour, au grand désarroi de ses parents qui avaient depuis sa naissance des projets à son égard, elle fugua, bien décidée à découvrir de quoi la vie, la vraie, était faite. Néanmoins, ses parents ne s'en inquièterent pas trop, persuadés qu'elle finirait par revenir, pleine de regret. Seulement, elle ne revint jamais. Pour gagner sa vie, elle rejoignit les Forces Terriennes de Protection en tant que pilote, où elle rencontra Carlos et George. Très vite, elle devint pilote stellaire d'élite à son tour, détrônant Carlos, de un an son aîné, au titre de plus jeune personne à avoir réussi cet exploit.`
})

pilotPreview3.addEventListener('click', () =>
{
    playEffect(clickSound, 0.4)
    pilotImage.setAttribute('src', './img/pilot3.png')
    loreTitle.textContent = `GEORGE WILLIAMSON`
    loreText.textContent = `George Williamson est né sur Terre et en est fier, n'hésitant parfois pas à le faire remarquer par des remarques à la limite de l'aliénophobie. Très sportif depuis son plus jeune âge, il a toujours privilégié le corps sain à l'esprit sain ; seulement, un jour, alors que lui et un de ses amis s'étaient rendus à la parade annuelle des Forces Terriennes de Protection, il se découvrit une passion pour le pilotage de vaisseau et la méchanique. Par sa motivation, son endurance et ses performances impressionnantes, il s'est très vite démarqué lorsqu'il rejoignit les FTP. Jamais ce soldat à la poigne de fer n'aurait pensé devenir un jour ami avec un criminel martien : sa rencontre avec Carlos lui fit apprendre bien plus qu'il ne le pensait. Lorsque la révolte Zblorg débuta, il fut assigné au rôle de pilote stellaire d'élite.`
})

resetloreText.addEventListener('click', () =>
{
    playEffect(clickSound, 0.4)
    pilotImage.setAttribute('src', './img/allPilots.png')
    loreTitle.innerHTML = `TERRA 2222 : <em>Le destin de l'humanité est entre vos mains</em>`
    loreText.textContent = `An 2222. L’humanité est parvenue à prendre le contrôle de la galaxie, où l’ordre est maintenu par le CIPTET (Conseil Interplanétaire des Peuples Terrestres et Extra-Terrestres). La paix règne depuis plus d’un siècle maintenant ; seulement, le Conseil a décidé de vous contacter, jeune pilote de vaisseau prodige, pour vous charger d’une mission secrète des plus importantes. Un peuple extra-terrestre dissident, les Zblorgs, a décidé de se rebeller, tentant au passage d’en rallier d’autres à sa cause. Pour empêcher cela, vous devrez vous aventurer en territoire ennemi... L’avenir de l’humanité est donc entre vos mains : sans vous, c’est la paix intergalactique qui est remise en cause… Alors, enclenchez vos réacteurs supersoniques, activez vos canons lasers et préparez vous à affronter vaisseaux spatiaux ennemis et bien pire !`
})
