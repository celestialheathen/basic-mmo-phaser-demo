// Create a config file for the game 

const config = {
    type: Phaser.AUTO,
    // height: 600,
    // width: 1200,
    scale: {
        mode: Phaser.Scale.FIT
    },
    parent: 'game',
    dom: {
        createContainer: true
    },
    physics: {
        default: 'arcade',
        arcade: { 
        // debug: true,
        gravity: {y: 0} }
    },
    scene: [Scene1, Scene2, Scene3, GameOver]
}

// Create a game
const game = new Phaser.Game(config)





