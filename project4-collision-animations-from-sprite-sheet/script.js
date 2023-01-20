/** @type {HTMLCanvasElement} */
const canvas = document.getElementById('canvas1')
const ctx = canvas.getContext('2d')

const CANVAS_WIDTH = canvas.width = 500
const CANVAS_HEIGHT = canvas.height = 700
const explosions = []
let canvasPosition = canvas.getBoundingClientRect() // providing information about the size of an element and its position relative to the viewport.


class Explosion {
    constructor(x, y) {
        // this.x = x
        // this.y = y
        this.spriteWidth = 200
        this.spriteHeight = 179
        this.width = this.spriteWidth * 0.7 /* it's better to multiply by 0.5 than divide */
        this.height = this.spriteHeight * 0.7
        this.x = x /* - this.width / 2 */ /* centering animation */
        this.y = y /* - this.height / 2 */
        this.image = new Image
        this.image.src = 'boom.png'
        this.frame = 0
        this.timer = 0
        this.angle = Math.random() * 6.2
        this.sound = new Audio
        this.sound.src = 'boom.wav'
    }
    update() {
        if (this.frame === 0) this.sound.play()
        this.timer++
        if (this.timer % 10 === 0) {
            this.frame++
        }
    }
    draw() {
        ctx.save()
        ctx.translate(this.x, this.y)
        ctx.rotate(this.angle)
        ctx.drawImage(this.image, this.spriteWidth * this.frame, 0,
            this.spriteWidth, this.spriteHeight,
            /* this.x */0 - this.width / 2,
            /* this.y */0 - this.height / 2,
            this.width, this.height)
        ctx.restore()
    }
}



window.addEventListener('click', function (e) {
    createAnimation(e)
    // let positionX = e.x - canvasPosition.left
    // let positionY = e.y - canvasPosition.top
    // explosions.push(new Explosion(positionX, positionY))
    // console.log(explosions)
    // // ctx.fillStyle = 'white'
    // // ctx.fillRect(e.x - canvasPosition.left - 25, e.y - canvasPosition.top - 25, 50, 50)
})

// window.addEventListener('mousemove', function (e) {
//     createAnimation(e)
// })



// creating a function to avoid code repetition
function createAnimation(e) {
    let positionX = e.x - canvasPosition.left
    let positionY = e.y - canvasPosition.top
    explosions.push(new Explosion(positionX, positionY))
}

function animate() {
    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT) // clears entire canvas
    for (let i = 0; i < explosions.length; i++) {
        explosions[i].update()
        explosions[i].draw()
        if (explosions[i].frame > 5) {
            explosions.splice(i, 1)
            i--
        }
    }

    requestAnimationFrame(animate)
}
animate()