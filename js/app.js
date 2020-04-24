/**************
* 
*    Welcome to the Back Quote's JavaScript file for Terra 2222 ! 
*           Summary :
*                   - Cross Browser, DOM querySelector for score & errors management, line 20-60 ( or ctrl+f for ID001 )
*                   - Canvas creation, background animation, main gameloop, init() and load of resources line 62-154 ( or ctrl+f for ID002 )
*                   - Variables creation line 154-253 ( or ctrl+f for ID003 )
*                   - Update game objects function line 253-404 ( or ctrl+f for ID004 )
*                   - Handle input function and counter for straf enemies movement line 404-527 ( or ctrl+f for ID005 )
*                   - UpdateEntities line 527-732 ( or ctrl+f for ID006 )
*                   - Collisions detection and checkbounds line 732-1083 ( or ctrl+f for ID007 )
*                   - Render function, gameOver, gameStart and reset line 1083-1231 ( or ctrl+f for ID008 )
*                   - Wiki and Boutique line 1231-1595 ( or ctrl+f for ID009 )
*                   - Sounds and backHome line 1595-1647 ( or ctrl+f for ID010)
*
**************/


/**************
cross Browser, DOM querySelector for score & errors management, line 20-60 (ID001)
**************/

// A cross-browser requestAnimationFrame
// Credits https://hacks.mozilla.org/2011/08/animating-with-javascript-from-setinterval-to-requestanimationframe/
const requestAnimFrame = (function(){
    return window.requestAnimationFrame    ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame    ||
        window.oRequestAnimationFrame      ||
        window.msRequestAnimationFrame     ||
        function(callback){
            window.setTimeout(callback, 1000 / 60)
        }
})()

//get elements from DOM for the score
const endScore = document.querySelector(".game-over-score")
const bestScoreText = document.querySelector('.game-over-best')
const endCoins = document.querySelector(".end-coins")
const endTotalCoins = document.querySelector('.coins-total')
const shopTotalCoins = document.querySelector('.shop-total-coins')
const wikiTotalCoins = document.querySelector('.wiki-total-coins')


// If error in the shop, this will be called
const error = document.querySelector('.error')
const errorClose = document.querySelector('.close-error')
const errorCoins = document.querySelector('.error-total-coins')

// Display of the error sound in the shop
function showError() {
    playEffect(errorSound, 0.4)
    error.style.display = "block"
}

// play sound close error button & remove error
errorClose.addEventListener('click', () => {
    playEffect(clickSound, 0.4)
    error.style.display = "none"
})

/**************
canvas creation, background animation, main gameloop, init() and load of resources line 62-154 (ID002)
**************/

// Create the canvas (the playground / the scene)
const canvas = document.querySelector(".canvas")
const ctx = canvas.getContext("2d")
canvas.width = window.innerWidth
canvas.height = window.innerHeight
document.body.appendChild(canvas)

// Creation of the background movement animation
let velocity = 4
let speedBg = 0

function backgroundSpeed() {
    speedBg += 1 * velocity
    canvas.style.backgroundPosition = `center ${speedBg}px`

    if (speedBg >= 100000) {
        speedBg = 0
    }

    setTimeout(backgroundSpeed, 2)
}
backgroundSpeed()

// Creation of the main game loop that will run the update, requestframe and render functions (continually update and render the game)
let lastTime
function main() {
    let now = Date.now()
    let dt = (now - lastTime) / 1000.0

    if(dt == 0){
        gameStart()
    }

    update(dt)
    render()

    lastTime = now
    requestAnimFrame(main)
}

//function init that will intialize the game => reset of the game and launching of it
function init() {
    document.querySelector('.play-again').addEventListener('click', function() {
        playEffect(clickSound, 0.4)
        reset()
    })

    document.querySelector('.play-start').addEventListener('click', function() {
        playEffect(clickSound, 0.4)
        reset()
    })

    document.querySelector('.close-game-over').addEventListener('click', function() {
        playEffect(clickSound, 0.4)
        reset()
    })

    document.querySelector('.close-game-start').addEventListener('click', function() {
        playEffect(clickSound, 0.4)
        reset()
    })

    reset()
    lastTime = Date.now()
    main()
}

//call resources.load and .onReady to register a callback when everything is loaded
resources.load([
    'img/player-sprite.png',
    'img/explosion-6.png',
    'img/explosion-5.png',
    'img/explosion-4.png',
    'img/enemy-1.png',
    'img/enemy-2.png',
    'img/enemy-4.png',
    'img/bullets.png',
    'img/enemy-4-destroyed.png',
    'img/vh10x.png',
    'img/45BHXTT.png',
    'img/FRX100.png',
    'img/enemy-5.png',
    'img/boss.png',
    'img/bullet-boss-1.png',
    'img/bullet-enemy-5.png',
    'img/bullet-boss-2.png'
])
resources.onReady(init)

/**************
variables creation line 154-253 (ID003)
**************/

// creation of the game state, data of a list of objects in the scene (player, bullets, score, ...)
//player, ennemies, bullets, explosions
const player = {
    pos: [0, 0],
    sprite: new Sprite('img/player-sprite.png', [0, 0], [128, 204], 8, [0, 1])
}

let bullets = []
let bulletEnemy5 = []

let enemies = []
let enemies5 = [] 

let boss = []
let bossBullet = []
let bossBullet2 = []
let bossBullet3 = []
let bossBullet4 = []

let explosions = []

//lastFire time for boss, enemies and boss spawn
let lastFire = Date.now()
let lastFireEnemy5 = Date.now()
let bossSpawn = Date.now()
let bossFire = Date.now()
let bossFire2 = Date.now()
let bossFire3 = Date.now()

//gameTIme and GameOver
let gameTime = 0
let isGameOver

//musics variables
let isSoundOn = true
const backgroundMusic = new Audio('audio/Venus.wav')
const deathSound = new Audio('audio/death.wav')
const idleJet = new Audio('audio/idle.wav')
const lobbyMusic = new Audio('audio/Lobby.mp3')
const clickSound = new Audio('audio/click.wav')
const successSound = new Audio('audio/success.wav')
const equipSound = new Audio('audio/equip.mp3')
const errorSound = new Audio('audio/error.wav')
const bossAppear = new Audio('audio/boss-appear.mp3')
const bossExplosion = new Audio('audio/boss-explosion.wav')
const bossDeath = new Audio('audio/boss-death.wav')

//score and coins
let score = 0
let bestScore = 0
let coins = 0
let totalCoins = 0
let scoreEl = document.querySelector('.score')

// Speed in pixels per second
let playerSpeed = 400
let bulletSpeed = 500
let bulletEnemy5Speed = 800
let enemySpeed = 200 * velocity
let enemy5Speed = 200
let bossSpeed = 100
let bossBulletSpeed = 300
let bossBullet2Speed = 500
let bossBullet3Speed = 500
let bossBullet4Speed = 400

//verifications for boss spawn + hp & points
let isBossSpawn = true
let bossSummoned = false
let onceFirstBoss = true
let onceSecondBoss = true
let onceThirdBoss = true
let onceFourthBoss = true
let onceFifthBoss = true
let onceSixthBoss = true

let bossHp = 1000
let bossPoints = 3000

//background check
let isBackgroundChanged = false

//bullets images
let bulletUp = new Sprite('img/bullets.png',[0, 0],[8, 27],4,[0, 1])
let bulletDiagRight = new Sprite('img/bullets.png', [16, 0], [20, 21],4,[0,1])
let bulletDiagLeft = new Sprite('img/bullets.png', [56, 0], [20, 21],4,[0,1])
let bulletRight = new Sprite('img/bullets.png',[76, 0],[27, 8],4,[0, 1])
let bulletLeft = new Sprite('img/bullets.png',[76, 8],[27, 8],4,[0, 1])

//superGun Check
let superGun = false

//cooldown for bullets
let bulletCooldown = 100

/**************
update game objects function line 253-404 (ID004)
**************/

// Update game objects and call input. Update all the sprites, the positions and handle collision
function update(dt) {
    gameTime += dt

    handleInput(dt)
    updateEntities(dt)

    //creation of enemies if gameOver is false (to prevent spawning enemies when gameOver)
    if(!isGameOver) { 
        if(!bossSummoned) {
            if (Math.random() < 0.01) {
                enemies.push({
                    pos: [(Math.random() * (canvas.width - 950)) + 400,
                        -200],
                        sprite: new Sprite('img/enemy-1.png', [0, 0], [58, 102], 
                        6, [0, 1, 2, 3, 2, 1]),
                    speed: 180 * velocity,
                    type: "fighter",
                    points: 150,
                    resistance: 1
                })
            } 

            if (Math.random() < 0.005) {
                enemies.push({
                    pos: [(Math.random() * (canvas.width - 950)) + 400,
                        -200],
                        sprite: new Sprite('img/enemy-2.png', [0, 0], [78, 149],
                        6, [0, 1, 2, 1]),
                    speed: 200 * velocity,
                    type: "brickade",
                    points: 200,
                    resistance: 3
                })
            } 

            if (Math.random() < 0.001) {
                enemies.push({
                    pos: [(Math.random() * (canvas.width - 950)) + 400,
                        -300],
                    sprite: new Sprite('img/enemy-4.png', [0, 0], [79, 310],
                                    6, [2, 2, 0, 0, 2, 2, 1, 1]),
                    speed: 100 * velocity,
                    type: "frigate",
                    points: 500,
                    resistance: 6
                })
            } 

            //enemies 5
            if(Math.random() < 0.004){
                enemies5.push({
                    pos: [canvas.width/2,
                    -150],
                    sprite: new Sprite('img/enemy-5.png', [0,0], [112, 151], 6, [0, 1, 2, 3, 2, 1]),
                    points: 200,
                    resistance: 3
                })
            }
        }

        //boss
        if(!isBossSpawn){
            score += 200
            isBossSpawn = true
            bossSummoned = true
            playEffect(bossAppear, 0.4)
            document.querySelector('.boss-bar').style.display = 'flex'
            document.querySelector('.boss-bar-remaining').textContent = bossHp
            document.querySelector('.boss-bar-full').textContent = bossHp
            boss.push({
                pos: [canvas.width/2 - 300,
                -400],
                sprite: new Sprite('img/boss.png', [0,0], [542, 400], 10, [0, 1, 2, 3, 2, 1]),
                points: bossPoints,
                resistance: bossHp
            })
        }

        if (score > 5000 && onceFirstBoss) {
            isBossSpawn = false
            onceFirstBoss = false
        }

        if (score > 15000 && onceSecondBoss) {
            isBossSpawn = false
            onceSecondBoss = false
            bossHp = 2000
            bossPoints = 5000
            bossSpeed = 100
            bossBulletSpeed = 400
            bossBullet2Speed = 600
            bossBullet3Speed = 600
        }

        if (score > 50000 && onceThirdBoss) {
            isBossSpawn = false
            onceThirdBoss = false
            bossHp = 3000
            bossPoints = 10000
            bossBulletSpeed = 600
            bossBullet2Speed = 600
            bossBullet3Speed = 600
        }

        if (score > 75000 && onceFourthBoss) {
            isBossSpawn = false
            onceFourthBoss = false
            bossHp = 5000
            bossPoints = 15000
            bossBulletSpeed = 600
            bossBullet2Speed = 800
            bossBullet3Speed = 800
        }

        if (score > 100000 && onceFifthBoss) {
            isBossSpawn = false
            onceFifthBoss = false
            bossHp = 7500
            bossPoints = 25000
            bossBulletSpeed = 800
            bossBullet2Speed = 800
            bossBullet3Speed = 800
        }

        if (score > 150000 && onceSixthBoss) {
            isBossSpawn = false
            onceSixthBoss = false
            bossHp = 15000
            bossPoints = 100000
            bossBulletSpeed = 1000
            bossBullet2Speed = 1000
            bossBullet3Speed = 1000
        }

        //change background at 100000 points
        if (score > 100000 && !isBackgroundChanged) {
            document.querySelector('.canvas').style.backgroundImage = "url(./img/background-2.jpg)"
            isBackgroundChanged = true
        }

        scoreEl.innerHTML = score
        endScore.innerHTML = 'Score : ' + score

        checkCollisions()
    }
}


/**************
handle input function and counter for straf enemies movement line 404-527 (ID005)
**************/

//project: to improve by adding english keyboard wasd
//playerSpeed * dt calculate the correct amount of pixels to move for that frame
//match player pos with input
function handleInput(dt) {
    if(input.isDown('DOWN') || input.isDown('s')) {
        player.pos[1] += playerSpeed * dt
    }

    if(input.isDown('UP') || input.isDown('z')) {
        player.pos[1] -= playerSpeed * dt
    }

    if(input.isDown('LEFT') || input.isDown('q')) {
        player.pos[0] -= playerSpeed * dt
    }

    if((input.isDown('LEFT') || input.isDown('q')) && input.isDown('SHIFT')) {
        player.pos[0] -= (playerSpeed * dt) * 2
    }

    if(input.isDown('RIGHT') || input.isDown('d')) {
        player.pos[0] += playerSpeed * dt
    }

    if((input.isDown('RIGHT') || input.isDown('d')) && input.isDown('SHIFT')) {
        player.pos[0] += (playerSpeed * dt) * 2
    }

    // Super Gun : perk available in the shop !
    if((input.isDown('x') || input.isDown('X')) &&
       !isGameOver &&
       Date.now() - lastFire > (bulletCooldown * 5) &&
       superGun) {
        let x = player.pos[0] + player.sprite.size[0] / 2
        let y = player.pos[1] + player.sprite.size[1] / 2

        bullets.push({ pos: [x, y],
                       dir: 'up',
                       sprite: bulletUp})
        bullets.push({ pos: [x, y],
                       dir: 'diagleft',
                       sprite: bulletDiagRight})
        bullets.push({ pos: [x, y],
                       dir: 'diagright',
                       sprite: bulletDiagLeft})
        bullets.push({ pos: [x, y],
                       dir: 'right',
                       sprite: bulletRight})
        bullets.push({ pos: [x, y],
                       dir: 'left',
                       sprite: bulletLeft})

        lastFire = Date.now()
    }

    // Super Shoot : allows to shoot in three directions if X key is held, 500ms of reboot time
    if((input.isDown('x') || input.isDown('X')) &&
       !isGameOver &&
       Date.now() - lastFire > (bulletCooldown * 5)) {
        let x = player.pos[0] + player.sprite.size[0] / 2
        let y = player.pos[1] + player.sprite.size[1] / 2

        bullets.push({ pos: [x, y],
                       dir: 'up',
                       sprite: bulletUp})
        bullets.push({ pos: [x, y],
                       dir: 'diagleft',
                       sprite: bulletDiagRight})
        bullets.push({ pos: [x, y],
                       dir: 'diagright',
                       sprite: bulletDiagLeft})

        lastFire = Date.now()
    }

    //the player can shoot if not gameover, he hit the space bar, and it's been more than 100 ms since the last bullet was fired
    if(input.isDown('SPACE') &&
       !isGameOver &&
       Date.now() - lastFire > bulletCooldown) {
        let x = player.pos[0] + player.sprite.size[0] / 2
        let y = player.pos[1] + player.sprite.size[1] / 2

        bullets.push({ pos: [x, y],
                       dir: 'up',
                       sprite: bulletUp})

        lastFire = Date.now()
    }

    if(input.isDown('r') && velocity <= 10) {
        velocity += 0.1
    }

    if(input.isDown('e') && velocity >= 1.5) {
        velocity -= 0.1
    }

    if(input.isDown('ENTER') && isGameOver === true) {
        reset()
    }

    if(input.isDown('ESCAPE') && isGameOver === false) {
        gameOver()
    }
}

// count for enemies 5 movement straf
let countStrafEnemy5 = 1
setInterval(function(){
    if(countStrafEnemy5 === 1){
        countStrafEnemy5 = 2
    }
    else{
        countStrafEnemy5 = 1
    }
},2000)

/**************
updateEntities line 527-732 (ID006)
**************/

function updateEntities(dt) {
    // Update the player sprite animation
    player.sprite.update(dt)

    // Update all the bullets
    for(let i=0; i<bullets.length; i++) {
        let bullet = bullets[i]
        bullets[i].sprite.update(dt)

        switch(bullet.dir) {
        case 'up': bullet.pos[1] -= bulletSpeed * dt
        break
        case 'diagleft': bullet.pos[1] -= bulletSpeed * dt, bullet.pos[0] -= bulletSpeed * dt
        break
        case 'diagright': bullet.pos[1] -= bulletSpeed * dt, bullet.pos[0] += bulletSpeed * dt
        break
        case 'left': bullet.pos[0] -= bulletSpeed * dt
        break
        case 'right': bullet.pos[0] += bulletSpeed * dt
        break

        default:
            bullet.pos[0] += bulletSpeed * dt
        }

        // Remove the bullet if it goes offscreen
        if(bullet.pos[1] < 0 || bullet.pos[1] > canvas.height ||
           bullet.pos[0] > canvas.width) {
            bullets.splice(i, 1)
            i--
        }
    }

    // Update all the enemies
    for(let i=0; i<enemies.length; i++) {
        enemies[i].pos[1] += enemies[i].speed * dt
        enemies[i].sprite.update(dt)

        // Remove if offscreen
        if(enemies[i].pos[1] + enemies[i].sprite.size[0] > canvas.height + 60) {
            enemies.splice(i, 1)
            i--
        }
    }

    //enemies type 5
    for(let i=0; i<enemies5.length; i++) {
        if(enemies5[i].pos[1] < 100){
            enemies5[i].pos[1] += enemy5Speed * dt
        }

        if(countStrafEnemy5 === 1){
            enemies5[i].pos[0] -= enemy5Speed * dt
        }
        else{
            enemies5[i].pos[0] += enemy5Speed * dt
        }
        enemies5[i].sprite.update(dt)
    }
    
    if(Date.now() - lastFireEnemy5 > 600){
    for(let i=0; i<enemies5.length; i++){
            if(enemies5.length > 0){

                let x = enemies5[i].pos[0] + enemies5[i].sprite.size[0] / 2
                let y = enemies5[i].pos[1] + enemies5[i].sprite.size[1] / 2

                bulletEnemy5.push({ pos: [x, y],
                    sprite: new Sprite('img/bullet-enemy-5.png', [0, 0], [25, 25]) })
            }
        }
        lastFireEnemy5 = Date.now()
    }

    for(let i=0; i<bulletEnemy5.length; i++) {
        let bulletE5 = bulletEnemy5[i]
        
        bulletE5.pos[1] += bulletEnemy5Speed * dt

        // Remove the bullet if it goes offscreen
        if(bulletE5.pos[1] < 0 || bulletE5.pos[1] > canvas.height ||
           bulletE5.pos[0] > canvas.width) {
            bulletEnemy5.splice(i, 1)
            i--
        }
    }

    //boss
    for(let i=0; i<boss.length; i++) {
        if(boss[i].pos[1] < -50){
            boss[i].pos[1] += bossSpeed * dt
        }
        boss[i].sprite.update(dt)
    }

    if(Date.now() - bossFire > 2000){
        for(let i=0; i<boss.length; i++){
            if(boss.length > 0){

                let x = boss[i].pos[0] + boss[i].sprite.size[0] / 2 - 25
                let y = boss[i].pos[1] + boss[i].sprite.size[1] / 2 + 30

                bossBullet.push({ pos: [x, y],
                    // sprite: new Sprite('img/bossullet.png', [0, 0], [60, 110], 0, [0]) })
                    sprite: new Sprite('img/bullet-boss-1.png', [0, 0], [30, 30]) })
            }
        }
        bossFire = Date.now()
    }
    
    for(let i=0; i<bossBullet.length; i++) {
        let bulletB = bossBullet[i]
        
        bulletB.pos[1] += bossBulletSpeed * dt

        // Remove the bullet if it goes offscreen
        if(bulletB.pos[1] < 0 || bulletB.pos[1] > canvas.height ||
            bulletB.pos[0] > canvas.width) {
            bossBullet.splice(i, 1)
            i--
        }
    }

    if(Date.now() - bossFire2 > 1000){
        for(let i=0; i<boss.length; i++){
            if(boss.length > 0){

                let x = boss[i].pos[0] + boss[i].sprite.size[0] / 2 - 25
                let y = boss[i].pos[1] + boss[i].sprite.size[1] / 2 + 60

                bossBullet2.push({ pos: [x, y],
                        dir: 'diagleft',
                        sprite: new Sprite('img/bullet-boss-1.png', [0, 0], [30, 30], 0, [0]) })
                bossBullet3.push({ pos: [x, y],
                        dir: 'diagleft',
                        sprite: new Sprite('img/bullet-boss-1.png', [0, 0], [30, 30], 0, [0]) })
            }
        }
        bossFire2 = Date.now()
    }

    for(let i=0; i<bossBullet2.length; i++) {
        let bulletB2 = bossBullet2[i]
        
        bulletB2.pos[1] += bossBullet2Speed * dt, bulletB2.pos[0] += bossBullet2Speed * dt

        // Remove the bullet if it goes offscreen
        if(bulletB2.pos[1] < 0 || bulletB2.pos[1] > canvas.height ||
           bulletB2.pos[0] > canvas.width) {
            bossBullet2.splice(i, 1)
            i--
        }
    }
    //bullet type 4
    for(let i=0; i<bossBullet3.length; i++) {
        let bulletB3 = bossBullet3[i]
        
        bulletB3.pos[1] += bossBullet3Speed * dt, bulletB3.pos[0] -= bossBullet3Speed * dt

        if(bulletB3.pos[1] < 0 || bulletB3.pos[1] > canvas.height ||
           bulletB3.pos[0] > canvas.width) {
            bossBullet3.splice(i, 1)
            i--
        }
    }
    if(Date.now() - bossFire3 > 1000){
        for(let i=0; i<boss.length; i++){
            if(boss.length > 0){
                let x = Math.random()* 900 + 500
                let y = boss[i].pos[1] + boss[i].sprite.size[1] / 2 + 60

                bossBullet4.push({ pos: [x, y],
                        sprite: new Sprite('img/bullet-boss-2.png', [0, 0], [30, 30], 0, [0]) })
            }
        }
        bossFire3 = Date.now()
    }
    for(let i=0; i<bossBullet4.length; i++) {
        let bulletB4 = bossBullet4[i]
        
        bulletB4.pos[1] += bossBullet4Speed * dt

        // Remove the bullet if it goes offscreen
        if(bulletB4.pos[1] < 0 || bulletB4.pos[1] > canvas.height ||
           bulletB4.pos[0] > canvas.width) {
            bossBullet4.splice(i, 1)
            i--
        }
    }

    // Update all the explosions
    for(let i=0; i<explosions.length; i++) {
        explosions[i].sprite.update(dt)

        // Remove if animation is done
        if(explosions[i].sprite.done) {
            explosions.splice(i, 1)
            i--
        }
    }
}


/**************
Collisions detection and checkbounds line 732-1083 (ID007)
**************/

// Collisions

//function for collistion detection (with their coordonates) simplified version of separating axis theorem
function collides(x, y, r, b, x2, y2, r2, b2) {
    return !(r <= x2 || x > r2 ||
             b <= y2 || y > b2)
}

function boxCollides(pos, size, pos2, size2) {
    return collides(pos[0], pos[1],
                    pos[0] + size[0], pos[1] + size[1],
                    pos2[0], pos2[1],
                    pos2[0] + size2[0], pos2[1] + size2[1])
}

function checkCollisions() {
    checkPlayerBounds()
    
    // Run collision detection for all enemies and bullets
    for(let i=0; i<enemies.length; i++) {
        let pos = enemies[i].pos
        let size = enemies[i].sprite.size

        for(let j=0; j<bullets.length; j++) {
            let pos2 = bullets[j].pos
            let size2 = bullets[j].sprite.size

            if(boxCollides(pos, size, pos2, size2)) {
                // Remove the enemy

                if (enemies[i].resistance > 1) {
                    enemies[i].resistance = enemies[i].resistance - 1
                    if(enemies[i].type === "frigate" && enemies[i].resistance < 4) {
                        enemies[i].sprite = new Sprite('img/enemy-4-destroyed.png', [0, 0], [79, 310],
                                            12, [0, 1, 2]),
                        explosions.push({
                            pos: [enemies[i].pos[0], enemies[i].pos[1] + 150],
                            sprite: new Sprite('img/explosion-6.png',
                                            [0, 0],
                                            [96, 96],
                                            16,
                                            [0, 1, 2, 3, 4, 5, 6, 7, 8],
                                            null,
                                            true)
                        })
                    }
                    if(enemies[i].type === "brickade") {
                        score += 50
                        explosions.push({
                            pos: pos,
                            sprite: new Sprite('img/explosion-5.png',
                                            [0, 0],
                                            [96, 96],
                                            16,
                                            [0, 1, 2, 3, 4, 5, 6, 7, 8],
                                            null,
                                            true)
                        })
                    }
                } else {
                    // Add score
                    if (!isGameOver) {
                        score += enemies[i].points
                    }

                    if (enemies[i].type === "frigate") {
                        explosions.push({
                            pos: pos,
                            sprite: new Sprite('img/explosion-6.png',
                                            [0, 0],
                                            [96, 96],
                                            16,
                                            [0, 1, 2, 3, 4, 5, 6, 7, 8],
                                            null,
                                            true)
                        })
                        explosions.push({
                            pos: [enemies[i].pos[0], enemies[i].pos[1] + 150],
                            sprite: new Sprite('img/explosion-6.png',
                                            [0, 0],
                                            [96, 96],
                                            16,
                                            [0, 1, 2, 3, 4, 5, 6, 7, 8],
                                            null,
                                            true)
                        })
                        explosions.push({
                            pos: [enemies[i].pos[0], enemies[i].pos[1] + 300],
                            sprite: new Sprite('img/explosion-6.png',
                                            [0, 0],
                                            [96, 96],
                                            16,
                                            [0, 1, 2, 3, 4, 5, 6, 7, 8],
                                            null,
                                            true)
                        })
                    }

                    enemies.splice(i, 1)
                    i--

                    // Add an explosion
                    if (Math.random() < 0.5) {
                        explosions.push({
                            pos: pos,
                            sprite: new Sprite('img/explosion-6.png',
                                            [0, 0],
                                            [96, 96],
                                            16,
                                            [0, 1, 2, 3, 4, 5, 6, 7, 8],
                                            null,
                                            true)
                        })
                    } else {
                        explosions.push({
                            pos: pos,
                            sprite: new Sprite('img/explosion-4.png',
                                            [0, 0],
                                            [128, 128],
                                            16,
                                            [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
                                            null,
                                            true)
                        })
                    }
                }

                // Remove the bullet and stop this iteration
                bullets.splice(j, 1)
                break
            }
        }

        if(boxCollides(pos, size, player.pos, player.sprite.size)) {
            if(!isGameOver) {
                gameOver()
            }
        }
    }

    //enemies 5 collisions
    for(let i=0; i<enemies5.length; i++) {
        let pos = enemies5[i].pos
        let size = enemies5[i].sprite.size
        let points = enemies5[i].points

        for(let j=0; j<bullets.length; j++) {
            let pos2 = bullets[j].pos
            let size2 = bullets[j].sprite.size

            if(boxCollides(pos, size, pos2, size2)) {
                // Remove the enemy
                    enemies5.splice(i, 1)
                    i--

                    // Add score
                    score += points

                    // Add an explosion
                    if (Math.random() < 0.5) {
                        explosions.push({
                            pos: pos,
                            sprite: new Sprite('img/explosion-6.png',
                                            [0, 0],
                                            [96, 96],
                                            16,
                                            [0, 1, 2, 3, 4, 5, 6, 7, 8],
                                            null,
                                            true)
                        })
                    } else {
                        explosions.push({
                            pos: pos,
                            sprite: new Sprite('img/explosion-4.png',
                                            [0, 0],
                                            [128, 128],
                                            16,
                                            [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
                                            null,
                                            true)
                        })
                    }

                    // Remove the bullet and stop this iteration
                    bullets.splice(j, 1)
                    break
            }
        }

        for(let j=0; j<bulletEnemy5.length; j++) {
            let pos2 = bulletEnemy5[j].pos
            let size2 = bulletEnemy5[j].sprite.size

            if(boxCollides(player.pos, player.sprite.size, pos2, size2)) {
                gameOver()
            }
        }
    }

    //BOSS collisions
    for(let i=0; i<boss.length; i++) {
        let pos = boss[i].pos
        let size = boss[i].sprite.size
        let points = boss[i].points

        for(let j=0; j<bullets.length; j++) {
            let pos2 = bullets[j].pos
            let size2 = bullets[j].sprite.size

            if(boxCollides(pos, size, pos2, size2)) {
                
                if (boss[i].resistance > 1) {
                    boss[i].resistance = boss[i].resistance - 1
                    document.querySelector('.boss-bar-remaining').textContent = boss[i].resistance
                    const bossPercentage = (boss[i].resistance / bossHp) * 100
                    document.querySelector('.boss-bar-life').style.width = bossPercentage + "%"
                    if(Math.random() < 1/10){
                        if(Math.random() < 1/2) {
                            explosions.push({
                                pos: [boss[i].pos[0] + Math.random() * 450, boss[i].pos[1] + 150 + Math.random() * 150],
                                sprite: new Sprite('img/explosion-6.png',
                                                [0, 0],
                                                [96, 96],
                                                16,
                                                [0, 1, 2, 3, 4, 5, 6, 7, 8],
                                                null,
                                                true)
                            })
                        } else {
                            explosions.push({
                                pos: [boss[i].pos[0] + Math.random() * 450, boss[i].pos[1] + 150 + Math.random() * 150],
                                sprite: new Sprite('img/explosion-4.png',
                                                [0, 0],
                                                [128, 128],
                                                16,
                                                [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
                                                null,
                                                true)
                            })
                        }

                        bullets.splice(j, 1)
                        j--
                        break
                }
                } else {
                    boss.splice(i, 1)
                        i--
                    // Add score
                    score += points

                    playEffect(bossExplosion, 0.4)
                    setTimeout(() => {
                        playEffect(bossDeath, 0.4)
                    }, 300)
                    bossSummoned = false

                    document.querySelector('.boss-bar').style.display = 'none'
                    document.querySelector('.boss-bar-life').style.width = "100%"

                    // Add an explosion
                    if (Math.random() < 0.5) {
                        explosions.push({
                            pos: pos,
                            sprite: new Sprite('img/explosion-6.png',
                                                [0, 0],
                                                [96, 96],
                                                16,
                                                [0, 1, 2, 3, 4, 5, 6, 7, 8],
                                                null,
                                                true)
                        })
                    } else {
                        explosions.push({
                            pos: pos,
                            sprite: new Sprite('img/explosion-4.png',
                                                [0, 0],
                                                [128, 128],
                                                16,
                                                [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
                                                null,
                                                true)
                        })
                    }

                    // Remove the bullet and stop this iteration
                    bullets.splice(j, 1)
                        j--
                    break
                }
            }
        }
        //boss bullets movements
        for(let j=0; j<bossBullet.length; j++) {
            let pos2 = bossBullet[j].pos
            let size2 = bossBullet[j].sprite.size

            if(boxCollides(player.pos, player.sprite.size, pos2, size2)) {
                gameOver()
            }
        }

        for(let j=0; j<bossBullet2.length; j++) {
            let pos2 = bossBullet2[j].pos
            let size2 = bossBullet2[j].sprite.size

            if(boxCollides(player.pos, player.sprite.size, pos2, size2)) {
                gameOver()
            }
        }
        for(let j=0; j<bossBullet3.length; j++) {
            let pos2 = bossBullet3[j].pos
            let size2 = bossBullet3[j].sprite.size

            if(boxCollides(player.pos, player.sprite.size, pos2, size2)) {
                gameOver()
            }
        }
        for(let j=0; j<bossBullet4.length; j++) {
            let pos2 = bossBullet4[j].pos
            let size2 = bossBullet4[j].sprite.size

            if(boxCollides(player.pos, player.sprite.size, pos2, size2)) {
                gameOver()
            }
        }
    }
}

function checkPlayerBounds() {
    // Check bounds for the player so he can't go where we don't want him to go
    if(player.pos[0] < 400) {
        player.pos[0] = 400
    }
    else if(player.pos[0] > canvas.width - 470) {
        player.pos[0] = canvas.width - 470
    }

    if(player.pos[1] < 0) {
        player.pos[1] = 0
    }
    else if(player.pos[1] > canvas.height - player.sprite.size[1]) {
        player.pos[1] = canvas.height - player.sprite.size[1]
    }
}

/**************
render function, gameOver, gameStart and reset line 1083-1231 (ID008)
**************/

// Draw everything
function render() {

    ctx.clearRect(0,0, canvas.width, canvas.height)

    // Render the player if the game isn't over
    if(!isGameOver) {
        renderEntity(player)
    }

    renderEntities(bullets)
    renderEntities(bulletEnemy5)
    renderEntities(enemies)
    renderEntities(enemies5)
    renderEntities(boss)
    renderEntities(bossBullet)
    renderEntities(bossBullet2)
    renderEntities(bossBullet3)
    renderEntities(bossBullet4)
    renderEntities(explosions)
}

function renderEntities(list) {
    for(let i=0; i<list.length; i++) {
        renderEntity(list[i])
    }    
}

function renderEntity(entity) {
    ctx.save()
    ctx.translate(entity.pos[0], entity.pos[1])
    entity.sprite.render(ctx)
    ctx.restore()
}

const startTotalCoins = document.querySelector('.start-coins-total')

// Game Begin (everything needed)
function gameStart() {
    document.querySelector('.game-start').style.display = 'block'
    document.querySelector('.boss-bar').style.display = 'none'
    coins = Math.floor(score/1000)
    totalCoins = totalCoins + coins
    startTotalCoins.textContent = totalCoins
    shopTotalCoins.textContent = totalCoins
    errorCoins.textContent = totalCoins
    wikiTotalCoins.textContent = totalCoins
    document.querySelector('.warning-total-coins').textContent = totalCoins
    isGameOver = true
    enemies5.splice(0,enemies5.length)
    bulletEnemy5.splice(0,bulletEnemy5.length)
    boss.splice(0,boss.length)
}

// Game over and what need to happen when the game is over
function gameOver() {
    playEffect(deathSound, 0.2)
    explosions.push({
        pos: player.pos,
        sprite: new Sprite('img/explosion-4.png',
                        [0, 0],
                        [128, 128],
                        24,
                        [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
                        null,
                        true)
        })
        explosions.push({
            pos: player.pos,
            sprite: new Sprite('img/explosion-6.png',
                            [0, 0],
                            [96, 96],
                            24,
                            [0, 1, 2, 3, 4, 5, 6, 7, 8],
                            null,
                            true)
        })
    document.querySelector('.game-over').style.display = 'block'
    document.querySelector('.boss-bar').style.display = 'none'
    if (score > bestScore) {
        bestScoreText.textContent = 'Meilleur score : ' + score
        bestScore = score
    }
    coins = Math.floor(score/1000)
    totalCoins = totalCoins + coins
    endCoins.textContent = "+" + coins
    endTotalCoins.textContent = totalCoins
    shopTotalCoins.textContent = totalCoins
    wikiTotalCoins.textContent = totalCoins
    document.querySelector('.warning-total-coins').textContent = totalCoins
    errorCoins.textContent = totalCoins
    isGameOver = true
    enemies5.splice(0,enemies5.length)
    bulletEnemy5.splice(0,bulletEnemy5.length)
    boss.splice(0,boss.length)
    stopMusic(backgroundMusic)
    stopMusic(idleJet)
    playMusic(lobbyMusic, 0.2)
}

// Reset game to original state
function reset() {
    document.querySelector('.game-over').style.display = 'none'
    document.querySelector('.canvas').style.backgroundImage = "url(./img/background.jpg)"
    document.querySelector('.game-start').style.display = 'none'
    isGameOver = false
    shopClose()
    playMusic(backgroundMusic, 0.2)
    playMusic(idleJet, 0.3)
    stopMusic(lobbyMusic)
    gameTime = 0
    score = 0
    speedBg = 0
    velocity = 2
    coins = 0
    isBossSpawn = true
    onceFirstBoss = true
    onceSecondBoss = true
    onceThirdBoss = true
    onceFourthBoss = true
    onceFifthBoss = true
    onceSixthBoss = true
    isBackgroundChanged = false
    bossHp = 1000
    bossPoints = 3000
    bossBulletSpeed = 300
    bossBullet2Speed = 500
    bossBullet3Speed = 500
    bossBullet4Speed = 400
    bossSummoned = false

    enemies = []
    enemies5 = []
    boss = [] 
    bullets = []
    bossBullet = []
    bossBullet2 = []
    bossBullet3 = []
    bossBullet4 = []

    player.pos = [canvas.width / 2, canvas.height - 204]
}


/**************
Wiki and Boutique line 1231-1595 (ID009)
**************/

// Wiki

let isFromStart2 = false

function wikiOpen(x){
    playEffect(clickSound, 0.4)
    document.querySelector('.wiki').style.display = "block"
    document.querySelector('.game-over').style.display = "none"
    document.querySelector('.game-start').style.display = "none"

    if (x == "start") {
        isFromStart2 = true
    }
}

function wikiCloseOver(){
    playEffect(clickSound, 0.4)
    document.querySelector('.wiki').style.display = "none"
    if (isFromStart2) {
        document.querySelector('.game-start').style.display = 'block'
        isFromStart2 = false
    } else {
        document.querySelector('.game-over').style.display = 'block'
    }
}

function wikiClose(){
    playEffect(clickSound, 0.4)
    document.querySelector('.wiki').style.display = "none"
    isFromStart2 = false
}

document.querySelector('.game-start-wiki').addEventListener('click', () => {
    wikiOpen("start")
})
document.querySelector('.game-over-wiki').addEventListener('click', () => {
    wikiOpen("over")
})

document.querySelector('.close-wiki').addEventListener('click', wikiCloseOver)


// Boutique


const shopButton = document.querySelector('.shop-button')
const closeShopButton = document.querySelector('.close-shop')
let isFromStart = false

function shopOpen(x){
    playEffect(clickSound, 0.4)
    document.querySelector('.shop').style.display = "block"
    document.querySelector('.game-over').style.display = "none"
    document.querySelector('.game-start').style.display = "none"

    if (x === "start") {
        isFromStart = true
    }
}

function shopCloseOver(){
    playEffect(clickSound, 0.4)
    document.querySelector('.shop').style.display = "none"
    if (isFromStart) {
        document.querySelector('.game-start').style.display = 'block'
        isFromStart = false
    } else {
        document.querySelector('.game-over').style.display = 'block'
    }
}

function shopClose(){
    playEffect(clickSound, 0.4)
    document.querySelector('.shop').style.display = "none"
    isFromStart = false
}

shopButton.addEventListener('click', () => {
    shopOpen("over")
})
document.querySelector('.start-shop-button').addEventListener('click', () => {
    shopOpen("start")
})
closeShopButton.addEventListener('click', shopCloseOver)

const equipPlayer1 = document.querySelector('.article-1-equip')
const equipPlayer2 = document.querySelector('.article-2-equip')
const equipPlayer3 = document.querySelector('.article-3-equip')
const equipPlayer4 = document.querySelector('.article-4-equip')

const buyPlayer2 = document.querySelector('.article-2-buy')
const buyPlayer3 = document.querySelector('.article-3-buy')
const buyPlayer4 = document.querySelector('.article-4-buy')

//equip the right article to the player
equipPlayer1.addEventListener('click', () => {

    if (document.querySelector('.article-2-actual').classList.contains('active')) {
        document.querySelector('.article-2-actual').classList.remove('active')
        document.querySelector('.article-2-bought').classList.add('active')
    }
    if (document.querySelector('.article-3-actual').classList.contains('active')) {
        document.querySelector('.article-3-actual').classList.remove('active')
        document.querySelector('.article-3-bought').classList.add('active')
    }
    if (document.querySelector('.article-4-actual').classList.contains('active')) {
        document.querySelector('.article-4-actual').classList.remove('active')
        document.querySelector('.article-4-bought').classList.add('active')
    }

    playEffect(equipSound, 0.4)
    document.querySelector('.article-1-bought').classList.remove('active')
    document.querySelector('.article-1-actual').classList.add('active')
    player.sprite = new Sprite('img/player-sprite.png', [0, 0], [128, 204], 8, [0, 1])

    if(!(document.querySelector(".article-8-actual").classList.contains('active'))) {
        bulletUp = new Sprite('img/bullets.png',[0, 0],[8, 27],4,[0, 1])
        bulletDiagRight = new Sprite('img/bullets.png', [16, 0], [20, 21],4,[0,1])
        bulletDiagLeft = new Sprite('img/bullets.png', [56, 0], [20, 21],4,[0,1])
        bulletRight = new Sprite('img/bullets.png',[76, 0],[27, 8],4,[0, 1])
        bulletLeft = new Sprite('img/bullets.png',[76, 8],[27, 8],4,[0, 1])
    }
})

buyPlayer2.addEventListener('click', () => {
    if (totalCoins >= 35) {
        totalCoins -= 35
        playEffect(successSound, 0.3)
        endTotalCoins.textContent = totalCoins
        shopTotalCoins.textContent = totalCoins
        errorCoins.textContent = totalCoins
        wikiTotalCoins.textContent = totalCoins
        document.querySelector('.warning-total-coins').textContent = totalCoins
        document.querySelector('.article-2-buydiv').classList.remove('active')
        document.querySelector('.article-2-bought').classList.add('active')
    } else {
        showError()
    }
})

equipPlayer2.addEventListener('click', () => {

    if (document.querySelector('.article-1-actual').classList.contains('active')) {
        document.querySelector('.article-1-actual').classList.remove('active')
        document.querySelector('.article-1-bought').classList.add('active')
    }
    if (document.querySelector('.article-3-actual').classList.contains('active')) {
        document.querySelector('.article-3-actual').classList.remove('active')
        document.querySelector('.article-3-bought').classList.add('active')
    }
    if (document.querySelector('.article-4-actual').classList.contains('active')) {
        document.querySelector('.article-4-actual').classList.remove('active')
        document.querySelector('.article-4-bought').classList.add('active')
    }

    playEffect(equipSound, 0.4)
    document.querySelector('.article-2-bought').classList.remove('active')
    document.querySelector('.article-2-actual').classList.add('active')

    player.sprite = new Sprite('img/vh10x.png', [0, 0], [159, 204], 8, [0, 1])

    if(!(document.querySelector(".article-8-actual").classList.contains('active'))) {
        bulletUp = new Sprite('img/bullets.png',[0, 54],[8, 27],4,[0, 1])
        bulletDiagRight = new Sprite('img/bullets.png', [16, 54], [20, 21],4,[0,1])
        bulletDiagLeft = new Sprite('img/bullets.png', [56, 54], [20, 21],4,[0,1])
        bulletRight = new Sprite('img/bullets.png',[76, 54],[27, 8],4,[0, 1])
        bulletLeft = new Sprite('img/bullets.png',[76, 62],[27, 8],4,[0, 1])
    }
})

buyPlayer3.addEventListener('click', () => {
    if (totalCoins >= 85) {
        totalCoins -= 85
        playEffect(successSound, 0.3)
        endTotalCoins.textContent = totalCoins
        shopTotalCoins.textContent = totalCoins
        errorCoins.textContent = totalCoins
        wikiTotalCoins.textContent = totalCoins
        document.querySelector('.warning-total-coins').textContent = totalCoins
        document.querySelector('.article-3-buydiv').classList.remove('active')
        document.querySelector('.article-3-bought').classList.add('active')
    } else {
        showError()
    }
})

equipPlayer3.addEventListener('click', () => {

    if (document.querySelector('.article-1-actual').classList.contains('active')) {
        document.querySelector('.article-1-actual').classList.remove('active')
        document.querySelector('.article-1-bought').classList.add('active')
    }
    if (document.querySelector('.article-2-actual').classList.contains('active')) {
        document.querySelector('.article-2-actual').classList.remove('active')
        document.querySelector('.article-2-bought').classList.add('active')
    }
    if (document.querySelector('.article-4-actual').classList.contains('active')) {
        document.querySelector('.article-4-actual').classList.remove('active')
        document.querySelector('.article-4-bought').classList.add('active')
    }

    playEffect(equipSound, 0.4)
    document.querySelector('.article-3-bought').classList.remove('active')
    document.querySelector('.article-3-actual').classList.add('active')

    player.sprite = new Sprite('img/FRX100.png', [0, 0], [152, 204], 8, [0, 1])

    if(!(document.querySelector(".article-8-actual").classList.contains('active'))) {
        bulletUp = new Sprite('img/bullets.png',[0, 54],[8, 27],4,[0, 1])
        bulletDiagRight = new Sprite('img/bullets.png', [16, 54], [20, 21],4,[0,1])
        bulletDiagLeft = new Sprite('img/bullets.png', [56, 54], [20, 21],4,[0,1])
        bulletRight = new Sprite('img/bullets.png',[76, 54],[27, 8],4,[0, 1])
        bulletLeft = new Sprite('img/bullets.png',[76, 62],[27, 8],4,[0, 1])
    }
})

buyPlayer4.addEventListener('click', () => {
    if (totalCoins >= 350) {
        totalCoins -= 350
        playEffect(successSound, 0.3)
        endTotalCoins.textContent = totalCoins
        shopTotalCoins.textContent = totalCoins
        errorCoins.textContent = totalCoins
        wikiTotalCoins.textContent = totalCoins
        document.querySelector('.warning-total-coins').textContent = totalCoins
        document.querySelector('.article-4-buydiv').classList.remove('active')
        document.querySelector('.article-4-bought').classList.add('active')
    } else {
        showError()
    }
})

equipPlayer4.addEventListener('click', () => {

    if (document.querySelector('.article-1-actual').classList.contains('active')) {
        document.querySelector('.article-1-actual').classList.remove('active')
        document.querySelector('.article-1-bought').classList.add('active')
    }
    if (document.querySelector('.article-2-actual').classList.contains('active')) {
        document.querySelector('.article-2-actual').classList.remove('active')
        document.querySelector('.article-2-bought').classList.add('active')
    }
    if (document.querySelector('.article-3-actual').classList.contains('active')) {
        document.querySelector('.article-3-actual').classList.remove('active')
        document.querySelector('.article-3-bought').classList.add('active')
    }

    playEffect(equipSound, 0.4)
    document.querySelector('.article-4-bought').classList.remove('active')
    document.querySelector('.article-4-actual').classList.add('active')
    player.sprite = new Sprite('img/45BHXTT.png', [0, 0], [79, 344], 6, [2, 2, 0, 0, 2, 2, 1, 1])

    if(!(document.querySelector(".article-8-actual").classList.contains('active'))) {
        bulletUp = new Sprite('img/bullets.png',[0, 27],[8, 27],4,[0, 1])
        bulletDiagRight = new Sprite('img/bullets.png', [16, 27], [20, 21],4,[0,1])
        bulletDiagLeft = new Sprite('img/bullets.png', [56, 27], [20, 21],4,[0,1])
        bulletRight = new Sprite('img/bullets.png',[76, 27],[27, 8],4,[0, 1])
        bulletLeft = new Sprite('img/bullets.png',[76, 35],[27, 8],4,[0, 1])
    }
})



const buyPerk5 = document.querySelector('.article-5-buy')
const buyPerk6 = document.querySelector('.article-6-buy')

buyPerk5.addEventListener('click', () => {
    
    if (totalCoins >= 60) {
        totalCoins -= 60
        playEffect(successSound, 0.3)
        endTotalCoins.textContent = totalCoins
        shopTotalCoins.textContent = totalCoins
        errorCoins.textContent = totalCoins
        wikiTotalCoins.textContent = totalCoins
        document.querySelector('.warning-total-coins').textContent = totalCoins
        document.querySelector('.article-5-buydiv').classList.remove('active')
        document.querySelector('.article-5-actual').classList.add('active')
        bulletCooldown = bulletCooldown * 0.75
    } else {
        showError()
    }
})

buyPerk6.addEventListener('click', () => {
    
    if (totalCoins >= 155) {
        totalCoins -= 155
        playEffect(successSound, 0.3)
        endTotalCoins.textContent = totalCoins
        shopTotalCoins.textContent = totalCoins
        errorCoins.textContent = totalCoins
        wikiTotalCoins.textContent = totalCoins
        document.querySelector('.warning-total-coins').textContent = totalCoins
        document.querySelector('.article-6-buydiv').classList.remove('active')
        document.querySelector('.article-6-actual').classList.add('active')
        superGun = true
    } else {
        showError()
    }
})

const buyPerk8 = document.querySelector('.article-8-buy')

const equipPerk7 = document.querySelector('.article-7-equip')
const equipPerk8 = document.querySelector('.article-8-equip')

equipPerk7.addEventListener('click', () => {

    if (document.querySelector('.article-8-actual').classList.contains('active')) {
        document.querySelector('.article-8-actual').classList.remove('active')
        document.querySelector('.article-8-bought').classList.add('active')
    }

    document.querySelector('.article-7-bought').classList.remove('active')
    document.querySelector('.article-7-actual').classList.add('active')

    playEffect(equipSound, 0.4)
    bulletUp = new Sprite('img/bullets.png',[0, 0],[8, 27],4,[0, 1])
    bulletDiagRight = new Sprite('img/bullets.png', [16, 0], [20, 21],4,[0,1])
    bulletDiagLeft = new Sprite('img/bullets.png', [56, 0], [20, 21],4,[0,1])
    bulletRight = new Sprite('img/bullets.png',[76, 0],[27, 8],4,[0, 1])
    bulletLeft = new Sprite('img/bullets.png',[76, 8],[27, 8],4,[0, 1])
})

buyPerk8.addEventListener('click', () => {
    if (totalCoins >= 880) {
        totalCoins -= 880
        playEffect(successSound, 0.3)
        endTotalCoins.textContent = totalCoins
        shopTotalCoins.textContent = totalCoins
        errorCoins.textContent = totalCoins
        wikiTotalCoins.textContent = totalCoins
        document.querySelector('.warning-total-coins').textContent = totalCoins
        document.querySelector('.article-8-buydiv').classList.remove('active')
        document.querySelector('.article-8-bought').classList.add('active')
    } else {
        showError()
    }
})

equipPerk8.addEventListener('click', () => {

    if (document.querySelector('.article-7-actual').classList.contains('active')) {
        document.querySelector('.article-7-actual').classList.remove('active')
        document.querySelector('.article-7-bought').classList.add('active')
    }

    document.querySelector('.article-8-bought').classList.remove('active')
    document.querySelector('.article-8-actual').classList.add('active')

    playEffect(equipSound, 0.4)
    bulletUp = new Sprite('img/bullets.png',[0, 81],[8, 27],4,[0, 1, 2, 3])
    bulletDiagRight = new Sprite('img/bullets.png', [32, 81], [20, 21],4,[0, 1, 2, 3])
    bulletDiagLeft = new Sprite('img/bullets.png', [112, 81], [20, 21],4,[0, 1, 2, 3])
    bulletRight = new Sprite('img/bullets.png',[0, 108],[27, 8],4,[0, 1, 2, 3])
    bulletLeft = new Sprite('img/bullets.png',[0, 116],[27, 8],4,[0, 1, 2, 3])
})

/**************
Sounds and backHome line 1595-1647 (ID010)
**************/

// Sound Effects

function playMusic(x, y) {
    if (isSoundOn) {
        x.setAttribute('loop', '')
        x.volume = y
        x.play()
    }
  }
function stopMusic(x){
    x.pause()
}

function playEffect(x, y) {
    if (isSoundOn) {
        x.volume = y
        x.play()
    }
}

document.querySelector('.sound-button').addEventListener('mousedown', () => {    
    if (isSoundOn) {
        isSoundOn = false
        stopMusic(idleJet)
        stopMusic(lobbyMusic)
        stopMusic(backgroundMusic)
        document.querySelector('.sound-button').style.backgroundImage = 'url(img/sound-off.png)'
    } else {
        isSoundOn = true
        document.querySelector('.sound-button').style.backgroundImage = 'url(img/sound-on.png)'
    }
})

// Back to homepage & warning if the player leave all his progression will be erased

function backHome() {
    playEffect(errorSound, 0.4)
    document.querySelector('.warning').style.display = "block"
}

function backHomeClose() {
    playEffect(clickSound, 0.4)
    document.querySelector('.warning').style.display = "none"
}

document.querySelector('.game-start-backhome').addEventListener('click', backHome)
document.querySelector('.game-over-backhome').addEventListener('click', backHome)
document.querySelector('.close-warning').addEventListener('click', backHomeClose)