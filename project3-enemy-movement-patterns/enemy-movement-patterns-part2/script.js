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
        this.image.src = 'enemy3.png'
        // this.x = 10
        // this.y = 50
        // this.x = Math.random() * (canvas.width - this.width)
        // this.y = Math.random() * (canvas.width - this.height)
        // this.width = 100
        // this.height = 100
        this.speed = Math.random() * 4 + 1
        this.spriteWidth = 218
        this.spriteHeight = 177
        this.width = this.spriteWidth / 2.5
        this.height = this.spriteHeight / 2.5
        this.x = Math.random() * (canvas.width - this.width) // to spawn inside canvas horizontally
        this.y = Math.random() * (canvas.height - this.height) // "  " vertically
        this.frame = 0
        this.flapSpeed = Math.floor(Math.random() * 3 + 1)
        this.angle = 0 // Math.random() * 2
        this.angleSpeed = Math.random() * 2 + 0.5
        // this.curve = Math.random() * 200 + 50
    }
    update() {
        // map a circular path if (Math.PI / same number) and will map an ellipse if movement is stretched
        // different (Math.PI / number) values will give different cycles
        this.x = /* this.curve  */ canvas.width / 2 * Math.sin(this.angle * Math.PI / 180) + canvas.width / 2 - this.width / 2 // sin wave movement and centering them horizontally
        this.y = /* this.curve */ canvas.height / 2 * Math.cos(this.angle * Math.PI / 180) + canvas.height / 2 - this.height / 2

        // this.x -= this.speed
        // this.y += this.curve * Math.sin(this.angle) // sin wave movement
        this.angle += this.angleSpeed
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