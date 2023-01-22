import { Sitting, Running, Jumping, Falling, Rolling } from "./playerStates.js"

export class Player {
    constructor(game) {
        this.game = game
        this.width = 100
        this.height = 91.3
        this.x = 0
        this.y = this.game.height - this.height - this.game.groundMargin
        this.vy = 0
        this.weight = 1
        this.image = player // JS automatically creates references to all elements with IDs into the global namespace, using it's ID as a variable name
        this.frameX = 0
        this.frameY = 0
        this.maxFrame
        this.fps = 20
        this.frameInterval = 1000 / this.fps
        this.frameTimer = 0
        this.speed = 0
        this.maxSpeed = 10
        this.states = [
            new Sitting(this), new Running(this),
            new Jumping(this), new Falling(this),
            new Rolling(this),
        ]
        this.currentState = this.states[0]
        this.currentState.enter()
    }
    update(input, deltaTime) {
        this.checkCollision()
        this.currentState.handleInput(input)
        // horizontal movement
        this.x += this.speed
        if (input.includes('ArrowRight')) this.speed = this.maxSpeed
        else if (input.includes('ArrowLeft')) this.speed = -this.maxSpeed
        else this.speed = 0
        // horizontal boundaries
        if (this.x < 0) this.x = 0
        if (this.x > this.game.width - this.width) this.x = this.game.width - this.width

        // vertical movement
        // if (input.includes('ArrowUp') && this.onGround()) this.vy -= 30
        this.y += this.vy
        if (!this.onGround()) this.vy += this.weight
        else this.vy = 0

        // sprite animation
        if (this.frameTimer > this.frameInterval) {
            this.frameTimer = 0
            if (this.frameX < this.maxFrame) this.frameX++
            else this.frameX = 0
        } else {
            this.frameTimer += deltaTime
        }

        // if (this.frameX < this.maxFrame) this.frameX++
        // else this.frameX = 0
    }
    draw(context) {
        if (this.game.debug) context.strokeRect(this.x, this.y, this.width, this.height)
        context.drawImage(this.image, this.frameX * this.width, this.frameY * this.height,
            this.width, this.height, this.x, this.y, this.width, this.height)
    }
    onGround() {
        return this.y >= this.game.height - this.height - this.game.groundMargin
    }
    setState(state, speed) {
        this.currentState = this.states[state]
        this.game.speed = this.game.maxSpeed * speed
        this.currentState.enter()
    }
    checkCollision() {
        this.game.enemies.forEach(enemy => {
            if (
                enemy.x < this.x + this.width &&
                enemy.x + enemy.width > this.x &&
                enemy.y < this.y + this.height &&
                enemy.y + enemy.height > this.y
            ) {
                // collision detected
                enemy.markedForDeletion = true
                this.game.score++
            } else {
                // no collision
            }
        });
    }
}