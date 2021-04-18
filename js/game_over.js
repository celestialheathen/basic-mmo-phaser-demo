class GameOver extends Phaser.Scene {
    constructor() {
        super("game_over")
    }

    create() {
        this.add.text(this.game.config.width / 2 - 80, this.game.config.height / 2, "The game is over.")
    }

}