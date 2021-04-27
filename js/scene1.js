class Scene1 extends Phaser.Scene {
    constructor() {
        super("scene_1")
    }

    init() {
        this.playerId = null
        this.x = null
        this.y = null
        let HOST = location.origin.replace(/^http/, 'ws')
        this.ws = new WebSocket(HOST)
        this.ws.onmessage = (message) => {
            const response = JSON.parse(message.data)

            if (response.method === "connect") {
                this.playerId = response.playerId
                this.x = response.x 
                this.y = response.y 
                console.log("Player id set successfully " + this.playerId)
                console.log("Player x " + this.x)
                console.log("Player y " + this.y)
            }
        }
    }

    preload() {
        this.load.image('bg', 'assets/background.png')
        this.load.image('shuriken', 'assets/shuriken.gif')
        this.load.audio('morning', 'assets/morning_mood.mp3')
        this.load.spritesheet('character', 'assets/character.png', {frameWidth: 32, frameHeight: 48})
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

        this.musicOn = false

        submitBtnElement.addListener('click')
        submitBtnElement.on('click', () => {
            if (this.userInput.value !== "") {
                this.player.createSpeechBubble(this.userInput.value)
                const payLoad = {
                    "playerId": this.playerId,
                    "method": "chat",
                    "body": this.userInput.value,
                    "x": this.player.x,
                    "y": this.player.y
                }
                this.ws.send(JSON.stringify(payLoad))
                this.userInput.value = ""
            }           
        })


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
        

        let bg = this.add.sprite(0,0, 'bg')
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


        this.otherPlayers = this.physics.add.group()

        const payLoad = {
            "method": "currentPlayers"
        }
        this.ws.send(JSON.stringify(payLoad))
        this.ws.onmessage = (message) => {
            const response = JSON.parse(message.data)

            if (response.method === "currentPlayers") {
                const playerId = response.playerId
                const x = response.x 
                const y = response.y 
                this.addOtherPlayers({x: x, y: y, playerId: playerId})
            }


            if (response.method === "disconnect") {
                console.log("A player disconnected, inside of scene1.js")
                this.removePlayer(response.playerId)
            } 

            if (response.method === "newPlayer") {
                console.log("a new player joined!")
                this.addOtherPlayers({x: response.x, y: response.y, playerId: response.playerId})
            }

            if (response.method === "updateLocation") {
                this.updateLocation({x: response.x, y: response.y, playerId: response.playerId, currentFacing: response.currentFacing})
            }

            if (response.method === "receiveChat") {
                this.broadcastMsg({x: response.x, y: response.y, playerId: response.playerId, body: response.body})
            }


        }

        this.createPlayer({scene: this, x: this.x, y: this.y, key: "character", playerId: this.playerId})

        this.lifeBar = document.createElement('label')
        this.lifeBar.style = `height: 18px; padding: 10px; width: ${this.player.health / 3}px; background-color: green`
        let lifeBarElement = this.add.dom(this.sys.canvas.width / 2 - 430, this.sys.canvas.height - 50, this.lifeBar).setDepth(1)

        this.bg_sound = this.sound.add('morning', {loop: true, volume: 0.1})

        this.cursors = this.input.keyboard.createCursorKeys()
        this.talkKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ONE)
        this.attackKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.TWO)
        this.input.addPointer(2)
    }

    update() {
        this.player.on("drag", (pointer, dragX, dragY) => {
            this.player.x = dragX
            this.player.y = dragY
            const payLoad = {
                method: "movement",
                "currentFacing": this.currentFacing,
                "playerId": this.playerId,
                "x": this.player.x,
                "y": this.player.y
            }
            this.ws.send(JSON.stringify(payLoad))
        })

        if (this.cursors.right.isDown) {
            this.player.body.setVelocityX(350)
            this.player.anims.play('right', true)
            this.currentFacing = this.playerFacing.right
            const payLoad = {
                method: "movement",
                "currentFacing": this.currentFacing,
                "playerId": this.playerId,
                "x": this.player.x,
                "y": this.player.y
            }
            this.ws.send(JSON.stringify(payLoad))
        }
        else if (this.cursors.left.isDown) {
            this.player.body.setVelocityX(-350)
            this.player.anims.play('left', true)
            this.currentFacing = this.playerFacing.left
            const payLoad = {
                method: "movement",
                "currentFacing": this.currentFacing,
                "playerId": this.playerId,
                "x": this.player.x,
                "y": this.player.y
            }
            this.ws.send(JSON.stringify(payLoad))
        }
        else if (this.cursors.up.isDown) {
            this.player.body.setVelocityY(-350)
            this.player.anims.play('up', true)
            this.currentFacing = this.playerFacing.up
            const payLoad = {
                method: "movement",
                "currentFacing": this.currentFacing,
                "playerId": this.playerId,
                "x": this.player.x,
                "y": this.player.y
            }
            this.ws.send(JSON.stringify(payLoad))
        }
        else if (this.cursors.down.isDown) {
            this.player.body.setVelocityY(350)
            this.player.anims.play('down', true)
            this.currentFacing = this.playerFacing.down
            const payLoad = {
                method: "movement",
                "currentFacing": this.currentFacing,
                "playerId": this.playerId,
                "x": this.player.x,
                "y": this.player.y
            }
            this.ws.send(JSON.stringify(payLoad))
                
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
        }


        if (this.player.x >= this.sys.canvas.width - 40) {
            this.bg_sound.stop()
            this.ws.close()
            this.scene.start("scene_2", {"player_y_pos": this.player.y, "playerId": this.playerId, "musicOn": this.musicOn})
        }   

        }


        
        createPlayer(playerInfo) {
            this.player = new Player({scene: this, x: playerInfo.x, y: playerInfo.y, key: "character", playerId: this.playerId})
        }

        addOtherPlayers(playerInfo) {
            const otherPlayer = this.add.sprite(playerInfo.x, playerInfo.y, "character")
            otherPlayer.setTint(Math.random() * 0xffffff)
            otherPlayer.setScale(1.5)
            otherPlayer.playerId = playerInfo.playerId
            this.otherPlayers.add(otherPlayer)
        }

        removePlayer(playerId) {
            this.otherPlayers.getChildren().forEach(player => {
                if (player.playerId === playerId) {
                    player.destroy()
                }
            })
        }

        updateLocation(playerInfo) {
            this.otherPlayers.getChildren().forEach(player => {
                if (player.playerId === playerInfo.playerId) {

                    switch (playerInfo.currentFacing) {
                        case 'LEFT': 
                        player.anims.play('left', true)
                        player.setPosition(playerInfo.x, playerInfo.y)
                        break;
                        case 'RIGHT': 
                        player.anims.play('right', true)
                        player.setPosition(playerInfo.x, playerInfo.y)
                        break;
                        case 'UP': 
                        player.anims.play('up', true)
                        player.setPosition(playerInfo.x, playerInfo.y)
                        break;
                        case 'DOWN': 
                        player.anims.play('down', true)
                        player.setPosition(playerInfo.x, playerInfo.y)
                        break;
                    }
                }
            })
        }

        broadcastMsg(info) {
            this.otherPlayers.getChildren().forEach(player => {
                if (player.playerId !== info.playerId) {

                    let bubble = this.add.graphics({x: info.x + 30, y: info.y - 65})
            
                    bubble.fillStyle(0xffffff, 1) 
                    bubble.lineStyle(4, 0x565656, 1)
                    bubble.strokeRoundedRect(0, 0, 150, 40, 16)
                    bubble.fillRoundedRect(0, 0, 150, 40, 16)
            
                    let content = this.add.text(0, 0, info.body, { fontSize: 12, color: 'black', align: 'center', wordWrap: {width: 150 - 20}})
                    let b = content.getBounds()
                    content.setPosition(bubble.x + 150 / 2 - b.width /2, bubble.y + 40 /2 - b.height /2)
            
                    setTimeout(() => {bubble.destroy(); content.destroy()}, 3000)
                
                }
            })
        }
    
    }

