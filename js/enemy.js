class Enemy extends Phaser.GameObjects.Sprite {
    constructor(config) {
        super(config.scene, config.x, config.y, config.key, config.portrait)

        this.scene = config.scene
        this.key = config.key
        this.portrait = config.portrait

        config.scene.add.existing(this)
        config.scene.physics.add.existing(this)
        this.body.setImmovable()
        this.setInteractive()
        this.setRandomPosition(0, 0, game.width, game.height)

        this.setScale(1.5)
        this.on('pointerdown', this.displayStatus)
    }

    displayStatus() {
        let bubble = this.scene.add.graphics({x: 80, y: 80})

        bubble.fillStyle(0xffffff, 1) 
        bubble.lineStyle(4, 0x565656, 1)
        bubble.strokeRoundedRect(0, 0, 250, 250, 16)
        bubble.fillRoundedRect(0, 0, 250, 250, 16)
        bubble.alpha = 0.3

        let content = this.scene.add.text(0, 0, this.key, { fontSize: 16, color: 'black', align: 'center', wordWrap: {width: 250 -20}})
        let b = content.getBounds()
        content.setPosition(bubble.x + 240 / 2 - b.width /2, bubble.y + 100 /2 - b.height /2)

        let portrait = this.scene.add.image(200, 220, this.portrait)

        setTimeout(() => {bubble.destroy(); content.destroy(); portrait.destroy()}, 1500)
    }


}