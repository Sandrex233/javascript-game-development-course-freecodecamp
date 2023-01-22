import { Player } from "./player.js"
import { InputHandler } from "./input.js"
import { Background } from "./background.js"
import { FlyingEnemy, GroundEnemy, ClimbingEnemy } from './enemies.js'
import { UI } from "./UI.js"


// same as window.addEventListener
// waits until images are loaded
window.addEventListener('load', function () {
    /** @type {HTMLCanvasElement} */
    const canvas = document.getElementById('canvas1')
    const ctx = canvas.getContext('2d')

    const CANVAS_WIDTH = canvas.width = 500
    const CANVAS_HEIGHT = canvas.height = 500

    class Game {
        constructor(width, height) {
            this.width = width
            this.height = height
            this.groundMargin = 80
            this.speed = 0
            this.maxSpeed = 4
            this.background = new Background(this)
            this.player = new Player(this) // this keyword means Game object
            this.input = new InputHandler(this)
            this.UI = new UI(this)
            this.enemies = []
            this.enemyTimer = 0
            this.enemyInterval = 1000
            this.debug = true
            this.score = 0
            this.fontColor = 'black'
        }
        update(deltaTime) {
            this.background.update()
            this.player.update(this.input.keys, deltaTime)
            // handle enemies
            if (this.enemyTimer > this.enemyInterval) {
                this.addNewEnemy()
                this.enemyTimer = 0
            } else {
                this.enemyTimer += deltaTime
            }
            this.enemies.forEach(enemy => {
                enemy.update(deltaTime)
                if (enemy.markedForDeletion) this.enemies.splice(this.enemies.indexOf(enemy), 1)
            })
        }
        draw(context) {
            this.background.draw(context)
            this.player.draw(context)
            this.enemies.forEach(enemy => {
                enemy.draw(context)
            })
            this.UI.draw(context)
        }
        addNewEnemy() {
            if (this.speed > 0 && Math.random() < 0.5) this.enemies.push(new FlyingEnemy(this))
            else if (this.speed > 0) this.enemies.push(new ClimbingEnemy(this))

            this.enemies.push(new GroundEnemy(this))
            console.log(this.enemies)
        }
    }

    const game = new Game(canvas.width, canvas.height)
    console.log(game);

    let lastTime = 0
    function animate(timeStamp) {
        const deltaTime = timeStamp - lastTime
        lastTime = timeStamp
        ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT)

        game.update(deltaTime)
        game.draw(ctx)

        requestAnimationFrame(animate)
    }
    animate(0)
})