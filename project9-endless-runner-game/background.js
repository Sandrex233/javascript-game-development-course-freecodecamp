class Layer {
    constructor(game, width, height, speedModifier, image) {
        this.game = game
        this.width = width
        this.height = height
        this.speedModifier = speedModifier
        this.image = image
        this.x = 0
        this.y = 0
    }
    update() {
        if (this.x < -this.width) this.x = 0
        else this.x -= this.game.speed * this.speedModifier
    }
    draw(context) {
        context.drawImage(this.image, this.x, this.y, this.width, this.height)
        context.drawImage(this.image, this.x + this.width, this.y, this.width, this.height)
    }
}



export class Background {
    constructor(game) {
        this.game = game
        this.width = 1667
        this.height = 500
        this.layer1image = layer1
        this.layer2image = layer2
        this.layer3image = layer3
        this.layer4image = layer4
        this.layer5image = layer5
        // parallax effect
        this.layer1 = new Layer(this.game, this.width, this.height, 0, this.layer1image)
        this.layer2 = new Layer(this.game, this.width, this.height, 0.2, this.layer2image)
        this.layer3 = new Layer(this.game, this.width, this.height, 0.4, this.layer3image)
        this.layer4 = new Layer(this.game, this.width, this.height, 0.8, this.layer4image)
        this.layer5 = new Layer(this.game, this.width, this.height, 1, this.layer5image)
        this.backgroundLayers = [this.layer1, this.layer2, this.layer3, this.layer4, this.layer5]
    }
    update() {
        this.backgroundLayers.forEach(layer => {
            layer.update()
        })
    }
    draw(context) {
        this.backgroundLayers.forEach(layer => {
            layer.draw(context)
        })
        // context.drawImage(this.image, this.frameX * this.width, this.frameY * this.height,
        //     this.width, this.height, this.x, this.y, this.width, this.height)
    }
}