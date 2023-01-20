// same as window.addEventListener
// waits until images are loaded\
addEventListener('load', function () {
    /** @type {HTMLCanvasElement} */
    const canvas = document.getElementById('canvas1')
    const ctx = canvas.getContext('2d')

    const CANVAS_WIDTH = canvas.width = 800
    const CANVAS_HEIGHT = canvas.height = 720

    let enemies = []
    let score = 0

    class InputHandler {
        constructor() {
            this.keys = []
            // use javascript bind method or ES6 arrow function, lexical scoping
            window.addEventListener('keydown', (e) => {
                if ((e.key === 'ArrowDown' ||
                    e.key === 'ArrowUp' ||
                    e.key === 'ArrowLeft' ||
                    e.key === 'ArrowRight')
                    && this.keys.indexOf(e.key) === -1) { // add only if that specific key is not in the array yet
                    this.keys.push(e.key)
                }
                console.log(e.key, this.keys)
            })
            window.addEventListener('keyup', (e) => {
                if ((e.key === 'ArrowDown' ||
                    e.key === 'ArrowUp' ||
                    e.key === 'ArrowLeft' ||
                    e.key === 'ArrowRight')) {
                    this.keys.splice(this.keys.indexOf(e.key), 1) // remove pressed key
                }
                console.log(e.key, this.keys)
            })
        }
    }

    class Player {
        constructor(gameWidth, gameHeight) {
            this.gameWidth = gameWidth
            this.gameHeight = gameHeight
            this.width = 200
            this.height = 200
            this.x = 0
            this.y = this.gameHeight - this.height
            this.image = document.getElementById('playerImage')
            this.maxFrame = 8
            this.frameX = 0
            this.frameY = 0
            this.fps = 20
            this.frameTimer = 0
            this.frameInterval = 1000 / this.fps
            this.speed = 0
            this.vy = 0
            this.weight = 1 // gravity
        }
        draw(context) {
            context.strokeStyle = 'white'
            context.strokeRect(this.x, this.y, this.width, this.height)
            context.beginPath()
            context.arc(this.x + this.width / 2, this.y + this.height / 2, this.width / 2, 0, Math.PI * 2)
            context.stroke()


            // context.fillStyle = 'white'
            // context.fillRect(this.x, this.y, this.width, this.height)
            context.drawImage(this.image, this.frameX * this.width,
                this.frameY * this.height, this.width, this.height,
                this.x, this.y, this.width, this.height)
        }
        update(input, deltaTime) {
            // sprite animation
            if (this.frameTimer > this.frameInterval) {
                if (this.frameX >= this.maxFrame) this.frameX = 0
                else this.frameX++
                this.frameTimer = 0
            } else {
                this.frameTimer += deltaTime
            }

            // controls
            if (input.keys.indexOf("ArrowRight") > -1) {
                this.speed = 5
            } else if (input.keys.indexOf("ArrowLeft") > -1) {
                this.speed = -5
            } else if (input.keys.indexOf("ArrowUp") > -1 && this.onGround()) {
                this.vy -= 32
            } else {
                this.speed = 0
            }

            // horizontal movement
            this.x += this.speed
            if (this.x < 0) this.x = 0
            else if (this.x > this.gameWidth - this.width) this.x = this.gameWidth - this.width

            // vertical movement
            this.y += this.vy
            if (!this.onGround()) {
                this.vy += this.weight
                this.maxFrame = 5
                // switching to jumping animation
                this.frameY = 1
            } else {
                this.vy = 0
                this.maxFrame = 8
                this.frameY = 0
            }
            if (this.y > this.gameHeight - this.height) this.y = this.gameHeight - this.height
        }
        onGround() {
            return this.y >= this.gameHeight - this.height
        }
    }

    class Background {
        constructor(gameWidth, gameHeight) {
            this.gameWidth = gameWidth
            this.gameHeight = gameHeight
            this.image = document.getElementById('backgroundImage')
            this.x = 0
            this.y = 0
            this.width = 2400
            this.height = 720
            this.speed = 7
        }
        draw(context) {
            context.drawImage(this.image, this.x, this.y, this.width, this.height)
            context.drawImage(this.image, this.x + this.width - this.speed, this.y, this.width, this.height)
        }
        update() {
            this.x -= this.speed // scroll to the left
            if (this.x < 0 - this.width) this.x = 0 // endlessly scrolling background
        }
    }

    class Enemy {
        constructor(gameWidth, gameHeight) {
            this.gameWidth = gameWidth
            this.gameHeight = gameHeight
            this.width = 160
            this.height = 119
            this.image = document.getElementById('enemyImage')
            this.x = this.gameWidth - 100
            this.y = this.gameHeight - this.height
            this.frameX = 0
            this.maxFrame = 5
            this.fps = 20
            this.frameTimer = 0
            this.frameInterval = 1000 / this.fps
            this.speed = 8
            this.markedForDeletion = false
        }
        draw(context) {
            context.strokeStyle = 'white'
            context.strokeRect(this.x, this.y, this.width, this.height)

            // context.drawImage(this.image, this.x, this.y, this.width, this.height)
            context.drawImage(this.image, this.frameX * this.width, 0, this.width, this.height,
                this.x, this.y, this.width, this.height)
        }
        update(deltaTime) {
            if (this.frameTimer > this.frameInterval) {
                if (this.frameX >= this.maxFrame) this.frameX = 0
                else this.frameX++
                this.frameTimer = 0
            } else {
                this.frameTimer += deltaTime
            }
            this.x -= this.speed
            if (this.x < 0 - this.width) {
                this.markedForDeletion = true
                score++
            }
        }
    }

    // enemies.push(new Enemy(canvas.width, canvas.height))

    function handleEnemies(deltaTime) {
        if (enemyTimer > enemyInterval + randomEnemyInterval) {
            enemies.push(new Enemy(canvas.width, canvas.height))
            randomEnemyInterval = Math.random() * 1000 + 500
            enemyTimer = 0
        } else {
            enemyTimer += deltaTime
        }
        enemies.forEach(enemy => {
            enemy.draw(ctx)
            enemy.update(deltaTime)
        })
        enemies = enemies.filter(enemy => !enemy.markedForDeletion)
    }

    function displayStatusText(context) {
        // Shadow effect
        context.font = '40px Helvetica'
        context.fillStyle = 'black'
        context.fillText('Score: ' + score, 20, 50)
        context.fillStyle = 'white'
        context.fillText('Score: ' + score, 22, 52)
    }

    const input = new InputHandler()
    const player = new Player(CANVAS_WIDTH, CANVAS_HEIGHT)
    // player.draw(ctx)
    // player.update()
    const background = new Background(CANVAS_WIDTH, CANVAS_HEIGHT)
    // const enemy1 = new Enemy(CANVAS_WIDTH, CANVAS_HEIGHT)

    let lastTime = 0
    let enemyTimer = 0
    let enemyInterval = 1000
    let randomEnemyInterval = Math.random() * 1000 + 500

    function animate(timestamp) {
        const deltaTime = timestamp - lastTime
        lastTime = timestamp
        console.log(deltaTime);
        ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT)
        background.draw(ctx)
        // background.update()
        player.draw(ctx)
        player.update(input, deltaTime)
        // enemy1.draw(ctx)
        // enemy1.update()
        handleEnemies(deltaTime)
        displayStatusText(ctx)
        requestAnimationFrame(animate)
    }
    animate(0)
})