class Scene3 extends Phaser.Scene {
    constructor() {
        super("scene_3")
    }

    init(data) {
        this.x = data.player_x_pos
        this.playerId = data.playerId
        this.health = data.lifebar
        this.musicOn = data.musicOn
    }

    preload() {
        this.load.image('background', 'assets/background1.png')

        this.load.spritesheet('character', 'assets/character.png', {frameWidth: 32, frameHeight: 48})

        this.load.spritesheet('bahamut', 'assets/bahamut.png', {frameWidth: 96, frameHeight: 96})
        this.load.spritesheet('leviathan', 'assets/leviathan.png', {frameWidth: 96, frameHeight: 96})
        this.load.spritesheet('silverbat', 'assets/silverbat.png', {frameWidth: 32, frameHeight: 48})
        this.load.spritesheet('ifrit', 'assets/ifrit.png', {frameWidth: 80, frameHeight: 80})
        this.load.spritesheet('odin', 'assets/odin.png', {frameWidth: 80, frameHeight: 80})
        this.load.spritesheet('phoenix', 'assets/phoenix.png', {frameWidth: 96, frameHeight: 96})
        this.load.spritesheet('siren', 'assets/siren.png', {frameWidth: 78, frameHeight: 48})
        this.load.spritesheet('shiva', 'assets/shiva.png', {frameWidth: 42, frameHeight: 48})

        this.load.image('shuriken', 'assets/shuriken.gif')
        this.load.image('firebomb', 'assets/firebomb.gif')
        this.load.image('snowbomb', 'assets/snowbomb.gif')
        this.load.audio('requiem', 'assets/requiem.mp3')

    }

    create() {
        // Create chatbox input text field and submit button
        this.userInput = document.createElement('input')
        this.userInput.type = "text"
        this.userInput.style = 'width: 500px; padding: 10px'
        
        let submitBtn = document.createElement('button')
        submitBtn.style = 'padding: 10px'
        submitBtn.innerText = "..."

        this.musicBtn = document.createElement('button')
        this.musicBtn.style = 'padding: 7px'
        this.musicBtn.innerText = '🎧'

        let userInputElement = this.add.dom(this.sys.canvas.width / 2, this.sys.canvas.height - 50, this.userInput).setDepth(1)
        let submitBtnElement = this.add.dom(this.sys.canvas.width / 2 + 290, this.sys.canvas.height - 50, submitBtn).setDepth(1)
        let musicBtnElement = this.add.dom(this.sys.canvas.width / 2 + 410, this.sys.canvas.height - 50, this.musicBtn).setDepth(1)

        // submitBtnElement.addListener('click')
        // submitBtnElement.on('click', () => {
        //     if (this.userInput.value !== "") {
        //         this.player.createSpeechBubble(this.userInput.value)
        //         const payLoad = {
        //             "playerId": this.playerId,
        //             "method": "chat",
        //             "body": this.userInput.value,
        //             "x": this.player.x,
        //             "y": this.player.y
        //         }
        //         this.ws.send(JSON.stringify(payLoad))
        //         this.userInput.value = ""
        //     }           
        // })


        musicBtnElement.addListener('click')
        musicBtnElement.on('click', () => {
            if (this.musicOn === false) {
                this.bg_sound.play()
                this.musicOn = !this.musicOn
            }
            else {
                this.bg_sound.pause() 
                this.musicOn = !this.musicOn
            }        
        })

        this.playerFacing = {
            'left': 'LEFT',
            'right': 'RIGHT',
            'up': 'UP',
            'down': 'DOWN'
        }
        this.currentFacing = this.playerFacing.up


        let bg = this.add.sprite(0,0, 'background')
        bg.setOrigin(0, 0)
        bg.displayWidth = this.sys.canvas.width
        bg.displayHeight = this.sys.canvas.height
        this.scale.displaySize.setAspectRatio(bg.displayWidth/bg.displayHeight.height)
        this.scale.refresh()

        this.anims.create({key: 'idle', frames: this.anims.generateFrameNames('character', {start: 0, end: 0})})
        this.anims.create({key: 'down', frames: this.anims.generateFrameNames('character', {start: 0, end: 3})})
        this.anims.create({key: 'left', frames: this.anims.generateFrameNames('character', {start: 4, end: 7})})
        this.anims.create({key: 'right', frames: this.anims.generateFrameNames('character', {start: 8, end: 11})})
        this.anims.create({key: 'up', frames: this.anims.generateFrameNames('character', {start: 12, end: 15})})


        this.anims.create({key: 'bahamut-idle', frames: this.anims.generateFrameNames('bahamut', {start: 0, end: 0})})
        this.anims.create({key: 'bahamut-down', frames: this.anims.generateFrameNames('bahamut', {start: 0, end: 3}), repeat: -1, frameRate: 5})
        this.anims.create({key: 'bahamut-left', frames: this.anims.generateFrameNames('bahamut', {start: 4, end: 7}), repeat: -1, frameRate: 5})
        this.anims.create({key: 'bahamut-right', frames: this.anims.generateFrameNames('bahamut', {start: 8, end: 11}), repeat: -1, frameRate: 5})
        this.anims.create({key: 'bahamut-up', frames: this.anims.generateFrameNames('bahamut', {start: 12, end: 15}), repeat: -1, frameRate: 5})
       
        this.anims.create({key: 'silverbat-idle', frames: this.anims.generateFrameNames('silverbat', {start: 0, end: 0})})
        this.anims.create({key: 'silverbat-down', frames: this.anims.generateFrameNames('silverbat', {start: 0, end: 3}), repeat: -1, frameRate: 5})
        this.anims.create({key: 'silverbat-left', frames: this.anims.generateFrameNames('silverbat', {start: 4, end: 7}), repeat: -1, frameRate: 5})
        this.anims.create({key: 'silverbat-right', frames: this.anims.generateFrameNames('silverbat', {start: 8, end: 11}), repeat: -1, frameRate: 5})
        this.anims.create({key: 'silverbat-up', frames: this.anims.generateFrameNames('silverbat', {start: 12, end: 15}), repeat: -1, frameRate: 5})
    
        this.anims.create({key: 'leviathan-idle', frames: this.anims.generateFrameNames('leviathan', {start: 0, end: 0})})
        this.anims.create({key: 'leviathan-down', frames: this.anims.generateFrameNames('leviathan', {start: 0, end: 3}), repeat: -1, frameRate: 5})
        this.anims.create({key: 'leviathan-left', frames: this.anims.generateFrameNames('leviathan', {start: 4, end: 7}), repeat: -1, frameRate: 5})
        this.anims.create({key: 'leviathan-right', frames: this.anims.generateFrameNames('leviathan', {start: 8, end: 11}), repeat: -1, frameRate: 5})
        this.anims.create({key: 'leviathan-up', frames: this.anims.generateFrameNames('leviathan', {start: 12, end: 15}), repeat: -1, frameRate: 5})
        
        this.anims.create({key: 'ifrit-idle', frames: this.anims.generateFrameNames('ifrit', {start: 0, end: 0})})
        this.anims.create({key: 'ifrit-down', frames: this.anims.generateFrameNames('ifrit', {start: 0, end: 3}), repeat: -1, frameRate: 5})
        this.anims.create({key: 'ifrit-left', frames: this.anims.generateFrameNames('ifrit', {start: 4, end: 7}), repeat: -1, frameRate: 5})
        this.anims.create({key: 'ifrit-right', frames: this.anims.generateFrameNames('ifrit', {start: 8, end: 11}), repeat: -1, frameRate: 5})
        this.anims.create({key: 'ifrit-up', frames: this.anims.generateFrameNames('ifrit', {start: 12, end: 15}), repeat: -1, frameRate: 5})
        
        this.anims.create({key: 'odin-idle', frames: this.anims.generateFrameNames('odin', {start: 0, end: 0})})
        this.anims.create({key: 'odin-down', frames: this.anims.generateFrameNames('odin', {start: 0, end: 3}), repeat: -1, frameRate: 5})
        this.anims.create({key: 'odin-left', frames: this.anims.generateFrameNames('odin', {start: 4, end: 7}), repeat: -1, frameRate: 5})
        this.anims.create({key: 'odin-right', frames: this.anims.generateFrameNames('odin', {start: 8, end: 11}), repeat: -1, frameRate: 5})
        this.anims.create({key: 'odin-up', frames: this.anims.generateFrameNames('odin', {start: 12, end: 15}), repeat: -1, frameRate: 5})
        
        this.anims.create({key: 'phoenix-idle', frames: this.anims.generateFrameNames('phoenix', {start: 0, end: 0})})
        this.anims.create({key: 'phoenix-down', frames: this.anims.generateFrameNames('phoenix', {start: 0, end: 3}), repeat: -1, frameRate: 5})
        this.anims.create({key: 'phoenix-left', frames: this.anims.generateFrameNames('phoenix', {start: 4, end: 7}), repeat: -1, frameRate: 5})
        this.anims.create({key: 'phoenix-right', frames: this.anims.generateFrameNames('phoenix', {start: 8, end: 11}), repeat: -1, frameRate: 5})
        this.anims.create({key: 'phoenix-up', frames: this.anims.generateFrameNames('phoenix', {start: 12, end: 15}), repeat: -1, frameRate: 5})

        this.anims.create({key: 'siren-idle', frames: this.anims.generateFrameNames('siren', {start: 0, end: 0})})
        this.anims.create({key: 'siren-down', frames: this.anims.generateFrameNames('siren', {start: 0, end: 3}), repeat: -1, frameRate: 5})
        this.anims.create({key: 'siren-left', frames: this.anims.generateFrameNames('siren', {start: 4, end: 7}), repeat: -1, frameRate: 5})
        this.anims.create({key: 'siren-right', frames: this.anims.generateFrameNames('siren', {start: 8, end: 11}), repeat: -1, frameRate: 5})
        this.anims.create({key: 'siren-up', frames: this.anims.generateFrameNames('siren', {start: 12, end: 15}), repeat: -1, frameRate: 5})

        this.anims.create({key: 'shiva-idle', frames: this.anims.generateFrameNames('shiva', {start: 0, end: 0})})
        this.anims.create({key: 'shiva-down', frames: this.anims.generateFrameNames('shiva', {start: 0, end: 3}), repeat: -1, frameRate: 5})
        this.anims.create({key: 'shiva-left', frames: this.anims.generateFrameNames('shiva', {start: 4, end: 7}), repeat: -1, frameRate: 5})
        this.anims.create({key: 'shiva-right', frames: this.anims.generateFrameNames('shiva', {start: 8, end: 11}), repeat: -1, frameRate: 5})
        this.anims.create({key: 'shiva-up', frames: this.anims.generateFrameNames('shiva', {start: 12, end: 15}), repeat: -1, frameRate: 5})


        this.player = new Player({scene: this, x: this.x, y: this.sys.canvas.height - 70, key: "character", playerId: this.playerId})
        this.player.health = this.health

        this.lifeBar = document.createElement('label')
        this.lifeBar.style = `height: 18px; padding: 10px; width: ${this.player.health / 3}px; background-color: green`
        let lifeBarElement = this.add.dom(this.sys.canvas.width / 2 - 430, this.sys.canvas.height - 50, this.lifeBar).setDepth(1)


        this.groupOfEnemies = this.add.group()
        this.bahamut = new Enemy ({scene: this, key: "bahamut"})
        this.bahamut.health = 250
        this.silverbat = new Enemy ({scene: this, key: "silverbat"})
        this.silverbat.health = 70
        this.leviathan = new Enemy ({scene: this, key: "leviathan"})
        this.leviathan.health = 200
        this.ifrit = new Enemy({scene: this, key: "ifrit"})
        this.ifrit.health = 170
        this.odin = new Enemy({scene: this, key: "odin"})
        this.odin.health = 280
        this.phoenix = new Enemy({scene: this, key: "phoenix"})
        this.phoenix.health = 90
        this.siren = new Enemy({scene: this, key: "siren"})
        this.siren.health = 120
        this.shiva = new Enemy({scene: this, key: "shiva"})
        this.shiva.health = 150

        this.groupOfEnemies.add(this.bahamut)
        this.groupOfEnemies.add(this.silverbat)
        this.groupOfEnemies.add(this.leviathan)
        this.groupOfEnemies.add(this.ifrit)
        this.groupOfEnemies.add(this.odin)
        this.groupOfEnemies.add(this.phoenix)
        this.groupOfEnemies.add(this.siren)
        this.groupOfEnemies.add(this.shiva)




        this.timedNpcEvent = this.time.addEvent({
            delay: 500,
            callback: this.randomNpcMovement,
            callbackScope: this,
            loop: true
        })

        this.cursors = this.input.keyboard.createCursorKeys()
        this.talkKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ONE)
        this.attackKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.TWO)
        this.input.addPointer(2)


        this.bg_sound = this.sound.add('requiem', {loop: true, volume: 0.1})
        if (this.musicOn === true) {this.bg_sound.play()}

        this.physics.add.collider(this.player, this.groupOfEnemies)

    }

    update() {
        this.player.on("drag", (pointer, dragX, dragY) => {
            this.player.x = dragX
            this.player.y = dragY
        })

        if (this.cursors.right.isDown) {
            this.player.body.setVelocityX(350)
            this.player.anims.play('right', true)
            this.currentFacing = this.playerFacing.right

        }
        else if (this.cursors.left.isDown) {
            this.player.body.setVelocityX(-350)
            this.player.anims.play('left', true)
            this.currentFacing = this.playerFacing.left

        }
        else if (this.cursors.up.isDown) {
            this.player.body.setVelocityY(-350)
            this.player.anims.play('up', true)
            this.currentFacing = this.playerFacing.up


        }
        else if (this.cursors.down.isDown) {
            this.player.body.setVelocityY(350)
            this.player.anims.play('down', true)
            this.currentFacing = this.playerFacing.down

                
        } else {
            this.player.body.setVelocity(0)
        }

        if (this.input.keyboard.checkDown(this.attackKey, 1000)) {
            switch (this.currentFacing) {
                case 'LEFT':
                        this.shuriken = this.add.sprite(this.player.x, this.player.y, 'shuriken')
                        this.add.existing(this.shuriken)
                        this.physics.world.enable(this.shuriken)
                        this.shuriken.body.setVelocityX(-400)

                    break;
                case 'RIGHT':
                    this.shuriken = this.add.sprite(this.player.x, this.player.y, 'shuriken')
                    this.add.existing(this.shuriken)
                    this.physics.world.enable(this.shuriken)
                    this.shuriken.body.setVelocityX(400)
                    break;
                case 'UP':
                    this.shuriken = this.add.sprite(this.player.x, this.player.y, 'shuriken')
                    this.add.existing(this.shuriken)
                    this.physics.world.enable(this.shuriken)
                    this.shuriken.body.setVelocityY(-400)
                    break;
                case 'DOWN':
                    this.shuriken = this.add.sprite(this.player.x, this.player.y, 'shuriken')
                    this.add.existing(this.shuriken)
                    this.physics.world.enable(this.shuriken)
                    this.shuriken.body.setVelocityY(400)
                    break;
            }

            this.physics.add.collider(this.shuriken, this.groupOfEnemies, (shuriken, group) => {
                shuriken.destroy()
                group.health -= 20
                if (group.health <= 0) {
                    group.destroy()
                }
            })
        }

        if (this.player.health <= 0) {
            this.cameras.main.flash(500, 0xff000000)
            setInterval(this.gameOver, 600)
        }
    }

    gameOver() {
        game.sound.stopAll()
        game.scene.remove("scene_3")
        game.scene.start("game_over")
        return
    }

    randomNpcMovement() {
        this.groupOfEnemies.getChildren().forEach(enemy => {
            const randNumber = Math.floor((Math.random() * 4) + 1)

            switch (randNumber) {
                case 1: 
                    enemy.anims.play(`${enemy.key}-right`)
                    enemy.body.setVelocityX(50)  
                    this.firebomb = this.add.sprite(enemy.x, enemy.y, 'firebomb')
                    this.add.existing(this.firebomb)
                    this.physics.world.enable(this.firebomb)
                    this.firebomb.body.setVelocityX(500)      
                    break;
                case 2:
                    enemy.anims.play(`${enemy.key}-left`)
                    enemy.body.setVelocityX(-50) 
                    this.firebomb = this.add.sprite(enemy.x, enemy.y, 'firebomb')
                    this.add.existing(this.firebomb)
                    this.physics.world.enable(this.firebomb)
                    this.firebomb.body.setVelocityX(-500)   
                    break;
                case 3:
                    enemy.anims.play(`${enemy.key}-up`)
                    enemy.body.setVelocityY(-50) 
                    this.firebomb = this.add.sprite(enemy.x, enemy.y, 'firebomb')
                    this.add.existing(this.firebomb)
                    this.physics.world.enable(this.firebomb)
                    this.firebomb.body.setVelocityY(-500)   
                    break;
                case 4:
                    enemy.anims.play(`${enemy.key}-down`)
                    enemy.body.setVelocityY(50)   
                    this.firebomb = this.add.sprite(enemy.x, enemy.y, 'firebomb')
                    this.add.existing(this.firebomb)
                    this.physics.world.enable(this.firebomb)
                    this.firebomb.body.setVelocityY(500)        
                    break;
                default: 
                    enemy.anims.play(`${enemy.key}-idle`)
                    enemy.body.setVelocityX(0)
            }

            setTimeout( () => {
                enemy.body.setVelocityX(0)
                enemy.body.setVelocityY(0)
            }, 200)

            this.physics.add.collider(this.player, this.firebomb, (player, firebomb) => {
                firebomb.destroy()
                this.player.health -= 30
                this.lifeBar.style = `height: 18px; padding: 10px; width: ${this.player.health / 3}px; background-color: green`
            })

        })
        }

}



