class Scene2 extends Phaser.Scene {
    constructor() {
        super("scene_2")
    }

    init(data) {
        this.y = data.player_y_pos
        this.playerId = data.playerId
        this.musicOn = data.musicOn
        console.log(this.playerId)
    }

    preload() {
        this.load.spritesheet('character', 'assets/character.png', {frameWidth: 32, frameHeight: 48})

        this.load.spritesheet('His Lordship Demes', 'assets/ponderstibbons.png', {frameWidth: 32, frameHeight: 48})
        this.load.spritesheet('Maximilian', 'assets/weddingguy.png', {frameWidth: 32, frameHeight: 48})
        this.load.spritesheet('Pirate Dayne', 'assets/jecht.png', {frameWidth: 32, frameHeight: 48})
        this.load.spritesheet('Aaron the Wandering Musician', 'assets/male.png', {frameWidth: 32, frameHeight: 48})
        this.load.spritesheet('Matthew the Berserker', 'assets/sallah.png', {frameWidth: 32, frameHeight: 48})
        this.load.spritesheet('Will the Scholar', 'assets/steampunk.png', {frameWidth: 32, frameHeight: 48})

        this.load.image('background', 'assets/background1.png')
        this.load.image('xpotion', 'assets/xpotion.gif')
        this.load.image('echoherbs', 'assets/echoherbs.gif')
        this.load.image('bronzeshield', 'assets/bronzeshield.gif')
        this.load.image('giantaxe', 'assets/giantaxe.gif')
        this.load.image('crystalmail', 'assets/crystalmail.gif')

        this.load.image('lordshipdemes', 'assets/lordshipdemes.png')
        this.load.image('max', 'assets/max.jpeg')
        this.load.image('dayne', 'assets/dayne.jpeg')
        this.load.image('aaron', 'assets/aaron.jpeg')
        this.load.image('matt', 'assets/matt.jpeg')
        this.load.image('will', 'assets/will.jpeg')

        this.load.image('shuriken', 'assets/shuriken.gif')
        this.load.audio('aog', 'assets/aog.mp3')
    }

    create() {


        // Create chatbox input text field and submit button
        this.userInput = document.createElement('input')
        this.userInput.type = "text"
        this.userInput.style = 'width: 500px; padding: 10px'
        
        let submitBtn = document.createElement('button')
        submitBtn.style = 'padding: 10px'
        submitBtn.innerText = "..."

        this.itemBtn = document.createElement('button')
        this.itemBtn.style = 'padding: 10px'
        this.itemBtn.innerText = 'Items'

        this.saveBtn = document.createElement('button')
        this.saveBtn.style = 'padding: 10px'
        this.saveBtn.innerText = 'Save'

        this.inventoryLabel = document.createElement('label')
        this.inventoryLabel.style = 'padding: 10px; width: 450px; color: white'
        this.inventoryLabel.innerText = ''

        this.musicBtn = document.createElement('button')
        this.musicBtn.style = 'padding: 7px'
        this.musicBtn.innerText = '🎧'

        let userInputElement = this.add.dom(this.sys.canvas.width / 2, this.sys.canvas.height - 50, this.userInput).setDepth(1)
        let submitBtnElement = this.add.dom(this.sys.canvas.width / 2 + 290, this.sys.canvas.height - 50, submitBtn).setDepth(1)
        let itemBtnElement = this.add.dom(this.sys.canvas.width / 2 - 300, this.sys.canvas.height - 50, this.itemBtn).setDepth(1)
        let inventoryLabelElement = this.add.dom(this.sys.canvas.width / 2, this.sys.canvas.height - 150, this.inventoryLabel).setDepth(1)
        let saveBtnElement = this.add.dom(this.sys.canvas.width / 2 + 350, this.sys.canvas.height - 50, this.saveBtn).setDepth(1)
        let musicBtnElement = this.add.dom(this.sys.canvas.width / 2 + 410, this.sys.canvas.height - 50, this.musicBtn).setDepth(1)


        let areItemsShown = false

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

        itemBtnElement.addListener('click')
        itemBtnElement.on('click', () => {
            if (areItemsShown === false) {
                fetch('http://localhost:3000/items')
                .then(r => r.json())
                .then(items => items.forEach((item) => {
                    this.inventoryLabel.textContent += item.name + " "
                }))
                areItemsShown = !areItemsShown
            } else {
                areItemsShown = !areItemsShown
                this.inventoryLabel.textContent = ""
            }
        })

        saveBtnElement.addListener('click') 
        saveBtnElement.on('click', () => {
            const newData = {
                "x": this.player.x,
                "y": this.player.y
            }
            const playerURL = this.playerId
            fetch(`http://localhost:3000/players/${playerURL}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(newData)
            })
            .then(r => r.json())
            .then(data => {console.log(playerURL, this.player.x, this.player.y)})
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

    
        this.anims.create({key: 'His Lordship Demes-idle', frames: this.anims.generateFrameNames('His Lordship Demes', {start: 0, end: 0})})
        this.anims.create({key: 'His Lordship Demes-down', frames: this.anims.generateFrameNames('His Lordship Demes', {start: 0, end: 3}), repeat: -1, frameRate: 5})
        this.anims.create({key: 'His Lordship Demes-left', frames: this.anims.generateFrameNames('His Lordship Demes', {start: 4, end: 7}), repeat: -1, frameRate: 5})
        this.anims.create({key: 'His Lordship Demes-right', frames: this.anims.generateFrameNames('His Lordship Demes', {start: 8, end: 11}), repeat: -1, frameRate: 5})
        this.anims.create({key: 'His Lordship Demes-up', frames: this.anims.generateFrameNames('His Lordship Demes', {start: 12, end: 15}), repeat: -1, frameRate: 5})

        this.anims.create({key: 'Maximilian-idle', frames: this.anims.generateFrameNames('Maximilian', {start: 0, end: 0})})
        this.anims.create({key: 'Maximilian-down', frames: this.anims.generateFrameNames('Maximilian', {start: 0, end: 3}), repeat: -1, frameRate: 5})
        this.anims.create({key: 'Maximilian-left', frames: this.anims.generateFrameNames('Maximilian', {start: 4, end: 7}), repeat: -1, frameRate: 5})
        this.anims.create({key: 'Maximilian-right', frames: this.anims.generateFrameNames('Maximilian', {start: 8, end: 11}), repeat: -1, frameRate: 5})
        this.anims.create({key: 'Maximilian-up', frames: this.anims.generateFrameNames('Maximilian', {start: 12, end: 15}), repeat: -1, frameRate: 5})

        this.anims.create({key: 'Pirate Dayne-idle', frames: this.anims.generateFrameNames('Pirate Dayne', {start: 0, end: 0})})
        this.anims.create({key: 'Pirate Dayne-down', frames: this.anims.generateFrameNames('Pirate Dayne', {start: 0, end: 3}), repeat: -1, frameRate: 5})
        this.anims.create({key: 'Pirate Dayne-left', frames: this.anims.generateFrameNames('Pirate Dayne', {start: 4, end: 7}), repeat: -1, frameRate: 5})
        this.anims.create({key: 'Pirate Dayne-right', frames: this.anims.generateFrameNames('Pirate Dayne', {start: 8, end: 11}), repeat: -1, frameRate: 5})
        this.anims.create({key: 'Pirate Dayne-up', frames: this.anims.generateFrameNames('Pirate Dayne', {start: 12, end: 15}), repeat: -1, frameRate: 5})

        this.anims.create({key: 'Aaron the Wandering Musician-idle', frames: this.anims.generateFrameNames('Aaron the Wandering Musician', {start: 0, end: 0})})
        this.anims.create({key: 'Aaron the Wandering Musician-down', frames: this.anims.generateFrameNames('Aaron the Wandering Musician', {start: 0, end: 3}), repeat: -1, frameRate: 5})
        this.anims.create({key: 'Aaron the Wandering Musician-left', frames: this.anims.generateFrameNames('Aaron the Wandering Musician', {start: 4, end: 7}), repeat: -1, frameRate: 5})
        this.anims.create({key: 'Aaron the Wandering Musician-right', frames: this.anims.generateFrameNames('Aaron the Wandering Musician', {start: 8, end: 11}), repeat: -1, frameRate: 5})
        this.anims.create({key: 'Aaron the Wandering Musician-up', frames: this.anims.generateFrameNames('Aaron the Wandering Musician', {start: 12, end: 15}), repeat: -1, frameRate: 5})

        this.anims.create({key: 'Matthew the Berserker-idle', frames: this.anims.generateFrameNames('Matthew the Berserker', {start: 0, end: 0})})
        this.anims.create({key: 'Matthew the Berserker-down', frames: this.anims.generateFrameNames('Matthew the Berserker', {start: 0, end: 3}), repeat: -1, frameRate: 5})
        this.anims.create({key: 'Matthew the Berserker-left', frames: this.anims.generateFrameNames('Matthew the Berserker', {start: 4, end: 7}), repeat: -1, frameRate: 5})
        this.anims.create({key: 'Matthew the Berserker-right', frames: this.anims.generateFrameNames('Matthew the Berserker', {start: 8, end: 11}), repeat: -1, frameRate: 5})
        this.anims.create({key: 'Matthew the Berserker-up', frames: this.anims.generateFrameNames('Matthew the Berserker', {start: 12, end: 15}), repeat: -1, frameRate: 5})

        this.anims.create({key: 'Will the Scholar-idle', frames: this.anims.generateFrameNames('Will the Scholar', {start: 0, end: 0})})
        this.anims.create({key: 'Will the Scholar-down', frames: this.anims.generateFrameNames('Will the Scholar', {start: 0, end: 3}), repeat: -1, frameRate: 5})
        this.anims.create({key: 'Will the Scholar-left', frames: this.anims.generateFrameNames('Will the Scholar', {start: 4, end: 7}), repeat: -1, frameRate: 5})
        this.anims.create({key: 'Will the Scholar-right', frames: this.anims.generateFrameNames('Will the Scholar', {start: 8, end: 11}), repeat: -1, frameRate: 5})
        this.anims.create({key: 'Will the Scholar-up', frames: this.anims.generateFrameNames('Will the Scholar', {start: 12, end: 15}), repeat: -1, frameRate: 5})

        this.player = new Player({scene: this, x: 60, y: this.y, key: "character", playerId: this.playerId})

        this.item1 = new Item({scene: this, key: "xpotion"})
        this.item2 = new Item({scene: this, key: "echoherbs"})
        this.item3 = new Item({scene: this, key: "bronzeshield"})
        this.item4 = new Item({scene: this, key: "giantaxe"})
        this.item5 = new Item({scene: this, key: "crystalmail"})



        this.groupOfNpcs = this.add.group()
        this.groupOfItems = this.add.group()

        this.lifeBar = document.createElement('label')
        this.lifeBar.style = `height: 18px; padding: 10px; width: ${this.player.health / 3}px; background-color: green`
        let lifeBarElement = this.add.dom(this.sys.canvas.width / 2 - 430, this.sys.canvas.height - 50, this.lifeBar).setDepth(1)



        this.demes = new Npc ({scene: this, x: 200, y: 300, key: "His Lordship Demes", portrait: "lordshipdemes", speech: ".........."})
        this.max = new Npc ({scene: this, x: 500, y: 320, key: "Maximilian", portrait: "max", speech: "Lovely day we’re having. Please leave."})
        this.dayne = new Npc ({scene: this, x: 740, y: 450, key: "Pirate Dayne", portrait: "dayne", speech: "arrrg matey"})
        this.aaron = new Npc ({scene: this, x: 300, y: 280, key: "Aaron the Wandering Musician", portrait: "aaron", speech: "Don't go to the forest up north."})
        this.matt = new Npc ({scene: this, x: 600, y: 200, key: "Matthew the Berserker", portrait: "matt", speech: "Go for it james!"})
        this.will = new Npc ({scene: this, x: 290, y: 540, key: "Will the Scholar", portrait: "will", speech: "Surprise me for the quote 😂"})

        this.groupOfNpcs.add(this.demes)
        this.groupOfNpcs.add(this.max)
        this.groupOfNpcs.add(this.dayne)
        this.groupOfNpcs.add(this.aaron)
        this.groupOfNpcs.add(this.matt)
        this.groupOfNpcs.add(this.will)

        this.groupOfItems.add(this.item1)
        this.groupOfItems.add(this.item2)
        this.groupOfItems.add(this.item3)
        this.groupOfItems.add(this.item4)
        this.groupOfItems.add(this.item5)


        this.timedNpcEvent = this.time.addEvent({
            delay: 1000,
            callback: this.randomNpcMovement,
            callbackScope: this,
            loop: true
        })

        this.cursors = this.input.keyboard.createCursorKeys()
        this.talkKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ONE)
        this.attackKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.TWO)
        this.input.addPointer(2)


        this.bg_sound = this.sound.add('aog', {loop: true, volume: 0.1})
        if (this.musicOn === true) {this.bg_sound.play()}

        this.physics.add.collider(this.player, this.groupOfNpcs, (player, group) => {
            if (this.input.keyboard.checkDown(this.talkKey, 2000)) {
                group.createSpeechBubble()

                fetch(`http://localhost:3000/items/`, {
                    method: "DELETE"
                })         
            } 
        })



        this.physics.add.overlap(this.player, this.groupOfItems, (player, group) => {

            fetch('http://localhost:3000/items', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({'pid': this.playerId, 'name': group.key})
            })
            .then(r => r.json())
            .then(data => {
                console.log("Item successfully logged to db")
            })
            this.player.health += 20
            this.lifeBar.style = `height: 18px; padding: 10px; width: ${this.player.health / 3}px; background-color: green`
            console.log(this.player.health)
            group.destroy()
        })

    }

    update() {

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
        }

        if (this.player.y <= 50) {
            this.bg_sound.stop()
            this.scene.start("scene_3", {"player_x_pos": this.player.x, "playerId": this.playerId, "lifebar": this.player.health, "musicOn": this.musicOn})
        }  

        // this.cameras.main.setZoom(Phaser.Math.Clamp(this.cameras.main.zoom, 1.5, 1.5))

    }

    randomNpcMovement() {
        this.groupOfNpcs.getChildren().forEach(npc => {
            const randNumber = Math.floor((Math.random() * 4) + 1)

            switch (randNumber) {
                case 1: 
                    npc.anims.play(`${npc.key}-right`)
                    npc.body.setVelocityX(30)          
                    break;
                case 2:
                    npc.anims.play(`${npc.key}-left`)
                    npc.body.setVelocityX(-30) 
                    break;
                case 3:
                    npc.anims.play(`${npc.key}-up`)
                    npc.body.setVelocityY(-30) 
                    break;
                case 4:
                    npc.anims.play(`${npc.key}-down`)
                    npc.body.setVelocityY(30)        
                    break;
                default: 
                    npc.anims.play(`${npc.key}-idle`)
                    npc.body.setVelocityX(0)
            }

            setTimeout( () => {
                npc.body.setVelocityX(0)
                npc.body.setVelocityY(0)
            }, 1500)

        })
        }

}


