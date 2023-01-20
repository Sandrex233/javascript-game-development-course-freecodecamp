/** @type {HTMLCanvasElement} */
const canvas = document.getElementById('canvas1')
const ctx = canvas.getContext('2d')

const CANVAS_WIDTH = canvas.width = 500
const CANVAS_HEIGHT = canvas.height = 900
const numberOfEnemies = 20
const enemiesArray = []

// const enemyImage = new Image
// enemyImage.src = 'enemy1.png'

let gameFrame = 0

// enemy1 = {
//     x: 0,
//     y: 0,
//     width: 200,
//     height: 200,
// }

// factory class ?
class Enemy {
    constructor() {
        this.image = new Image
        this.image.src = 'enemy4.png'
        this.speed = Math.random() * 4 + 1
        this.spriteWidth = 213
        this.spriteHeight = 213
        this.width = this.spriteWidth / 2
        this.height = this.spriteHeight / 2
        this.x = Math.random() * (canvas.width - this.width) // to spawn inside canvas horizontally
        this.y = Math.random() * (canvas.height - this.height) // "  " vertically
        this.newX = Math.random() * (canvas.width - this.width)
        this.newY = Math.random() * (canvas.height - this.height)
        this.frame = 0
        this.flapSpeed = Math.floor(Math.random() * 3 + 1)
        this.interval = Math.floor(Math.random() * 200 + 50)
    }
    update() {
        // position change every interval frames
        if (gameFrame % this.interval == 0) {
            this.newX = Math.random() * (canvas.width - this.width)
            this.newY = Math.random() * (canvas.height - this.height)
        }
        // this.x = 0
        // this.y = 0
        let dx = this.x - this.newX
        let dy = this.y - this.newY
        this.x -= dx / 70
        this.y -= dy / 70


        if (this.x + this.width < 0) this.x = canvas.width

        // animate sprites
        if (gameFrame % this.flapSpeed === 0) {
            this.frame > 4 ? this.frame = 0 : this.frame++
        }
    }
    draw() {
        // ctx.fillRect(this.x, this.y, this.width, this.height)
        // ctx.strokeRect(this.x, this.y, this.width, this.height)
        ctx.drawImage(this.image, this.frame * this.spriteWidth, 0, this.spriteWidth, this.spriteHeight, this.x, this.y, this.width, this.height)
    }
}

// const enemy1 = new Enemy()
// const enemy2 = new Enemy()

for (let i = 0; i < numberOfEnemies; i++) {
    enemiesArray.push(new Enemy)
}

function animate() {
    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT)
    // enemy1.update()

    // enemy1.x++
    // enemy1.y++

    // enemy2.x += 0.5
    // enemy2.y += 0.5

    // enemy1.draw() // reusable and scalable
    // ctx.fillRect(enemy1.x, enemy1.y, enemy1.width, enemy1.height)
    // ctx.fillRect(enemy2.x, enemy2.y, enemy2.width, enemy2.height)

    enemiesArray.forEach(enemy => {
        enemy.update()
        enemy.draw()
    })

    gameFrame++
    requestAnimationFrame(animate)
}
animate()