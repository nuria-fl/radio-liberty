import { Physics } from 'phaser'
import { SCENES, IMAGES, AUDIO, SPRITES } from '../constants'
import { Survivor } from '../sprites/Survivor'
import { Buggy } from '../sprites/Buggy'
import { Stranger } from '../sprites/Stranger'
import { Firepit } from '../sprites/Firepit'
import { Antenna } from '../sprites/Antenna'
import { Boxes } from '../sprites/Boxes'
import { MetalBox } from '../sprites/MetalBox'
import { Bucket } from '../sprites/Bucket'
import { Ladder } from '../sprites/Ladder'
import { cameraFade, cameraPan, timer } from '../utils/promisify'
import { BaseScene } from './BaseScene'
import { randomLine } from '../default-lines'

class BuildingScene extends BaseScene {
  public use = {
    ...this.use,
    survivorBox: {
      setText: null,
      name: 'Survivor',
      use: () => {
        // copied from base scene. should unify somewhere
        this.interactingWithObject = true
        if (this.currentObject.consumable) {
          document.dispatchEvent(
            new CustomEvent('consume', {
              detail: { id: this.currentObject.id },
            })
          )
          return this.createDialog('Ah… much better')
        }

        if (this.currentObject.id === 'taser') {
          return this.createDialog('NO WAY!!')
        }

        if (this.currentObject.id === 'cloth') {
          if (this.cleanWound) {
            document.dispatchEvent(new CustomEvent('getCured'))
            this.stopHurtEffect()
            this.removeItem({ id: 'cloth' })
            return this.createDialog(
              'Good, that should stop the bleeding for now.'
            ).then(() => {
              this.isCured = true
              return this.checkIfFinished()
            })
          }
          return this.createDialog(
            "I should clean up the wound first. I'm gonna need some medical supplies."
          )
        }

        if (this.currentObject.id === 'solution') {
          this.cleanWound = true
          this.removeItem({ id: 'solution' })
          return this.createDialog(
            'Wound is now clean, I should cover it as soon as possible'
          )
        }

        return this.createDialog(randomLine())
      },
    },
    buggy: {
      setText: null,
      name: 'Buggy',
      use: () => {
        this.interactingWithObject = true
        return this.createDialog(randomLine())
      },
    },
    ladder: {
      setText: null,
      name: 'Ladder',
      use: () => {
        this.interactingWithObject = true
        return this.createDialog(randomLine())
      },
    },
    bucket: {
      setText: null,
      name: 'Bucket',
      use: () => {
        this.interactingWithObject = true
        return this.createDialog(randomLine())
      },
    },
    puddle: {
      setText: null,
      name: 'Puddle',
      use: () => {
        this.interactingWithObject = true
        if (this.currentObject.id === 'bottle') {
          return this.createDialog(
            "I can't, there's a cork stopper stuck halfway."
          )
        }
        if (this.currentObject.id === 'bucket') {
          return this.setUpWaterCollector()
        }
        return this.createDialog(randomLine())
      },
    },
    wall: {
      setText: null,
      name: 'Wall',
      use: () => {
        this.interactingWithObject = true
        return this.createDialog(randomLine())
      },
    },
    pit: {
      setText: null,
      name: 'Fire pit',
      use: () => {
        this.interactingWithObject = true
        if (this.currentObject.id === 'wood') {
          return this.addWood()
        }
        if (this.currentObject.id === 'brokenGlass') {
          return this.setUpFire()
        }
        if (this.currentObject.id === 'pinecone') {
          return this.createDialog(
            "It would burn too fast. Besides, I could really use the pine nuts, I'm low on food!"
          )
        }
        if (this.currentObject.id === 'bottle') {
          return this.createDialog(
            'The glass looks thick enough to act as a magnifying glass! But I should break the bottle to just use a piece.'
          )
        }
        return this.createDialog(randomLine())
      },
    },
    wood: {
      setText: null,
      name: 'Wood',
      use: () => {
        this.interactingWithObject = true
        return this.createDialog(randomLine())
      },
    },
    rock: {
      setText: null,
      name: 'Rock',
      use: () => {
        this.interactingWithObject = true
        if (this.currentObject.id === 'bottle') {
          return this.breakBottle()
        }
        if (this.currentObject.id === 'pinecone') {
          return this.getNuts()
        }
        return this.createDialog(randomLine())
      },
    },
    stranger: {
      setText: null,
      name: 'Stranger',
      use: () => {
        this.interactingWithObject = true

        if (this.currentObject.id === 'taser') {
          return this.finishEncounter()
        }
        return this.createDialog(randomLine())
      },
    },
  }

  public interact = {
    buggy: {
      key: 'interactBuggy',
      text: 'Look at buggy',
      cb: this.interactBuggy,
    },
    bucket: {
      key: 'interactBucket',
      text: 'Pick up bucket',
      cb: this.interactBucket,
    },
    ladder: {
      key: 'interactLadder',
      text: 'Use ladder',
      cb: this.interactLadder,
      permanent: true,
    },
    wood: {
      key: 'interactWood',
      text: 'Pick up wood',
      cb: this.interactWood,
    },
    rock: {
      key: 'interactRock',
      text: 'Pick up rock',
      cb: this.interactRock,
    },
    puddle: {
      key: 'interactPuddle',
      text: 'Look at puddle',
      cb: this.interactPuddle,
    },
    wall: {
      key: 'interactWall',
      text: 'Look at wall',
      cb: this.interactWall,
    },
    pit: {
      key: 'interactPit',
      text: 'Look at pit',
      cb: this.interactPit,
    },
    antennas: {
      key: 'interactAntennas',
      text: 'Look at antennas',
      cb: this.interactAntennas,
    },
    cloth: {
      key: 'interactCloth',
      text: 'Pick up cloth',
      cb: this.interactCloth,
    },
    metalBox: {
      key: 'interactBox',
      text: 'Look at box',
      cb: this.interactBox,
    },
    bottle: {
      key: 'interactBottle',
      text: 'Pick up bottle',
      cb: this.interactBottle,
    },
    note: {
      key: 'lookNote',
      text: 'Pick up note',
      cb: this.interactNote,
    },
  }

  public interactKeys = [
    'bucket',
    'ladder',
    'wood',
    'puddle',
    'wall',
    'pit',
    'antennas',
    'buggy',
    'rock',
    'metalBox',
    'bottle',
    'note',
  ]

  public WORLD = {
    WIDTH: 1280,
    HEIGHT: 800,
  }
  public survivor: Survivor
  private buggy: Buggy
  private stranger: Stranger
  private ladder: Ladder
  private bucket: Bucket
  private boxes: Boxes
  private metalBox: MetalBox
  private pit: Firepit
  private trees: Phaser.GameObjects.TileSprite
  private hills: Phaser.GameObjects.TileSprite
  private grassForeground: Phaser.GameObjects.TileSprite
  private upstairsFloor: Physics.Arcade.Sprite
  private floor: Physics.Arcade.Sprite
  private platforms: Physics.Arcade.StaticGroup
  private antennasSprites: Physics.Arcade.Group
  private dropAnimation: Phaser.Tweens.Tween
  private forest: Phaser.GameObjects.Image
  private nightBackground: Phaser.GameObjects.Image
  private nightForeground: Phaser.GameObjects.Image
  private wood: Physics.Arcade.Image
  private bottle: Physics.Arcade.Image
  private puddle: Physics.Arcade.Image
  private wall: Physics.Arcade.Image
  private antennas: Physics.Arcade.Image
  private rock: Physics.Arcade.Image
  private cloth: Physics.Arcade.Image
  private note: Physics.Arcade.Image
  private drop: Phaser.GameObjects.Image
  private bgAudio: Phaser.Sound.BaseSound
  private nightAudio: Phaser.Sound.BaseSound
  private attackAudio: Phaser.Sound.BaseSound
  private fireAudio: Phaser.Sound.BaseSound
  private staticAudio: Phaser.Sound.BaseSound
  private dropAudio: Phaser.Sound.BaseSound
  private bangAudio: Phaser.Sound.BaseSound
  private rockAudio: Phaser.Sound.BaseSound
  private brokenGlassAudio: Phaser.Sound.BaseSound
  private bucketAudio: Phaser.Sound.BaseSound
  private placeAudio: Phaser.Sound.BaseSound
  private growlAudio: Phaser.Sound.BaseSound
  private growl2Audio: Phaser.Sound.BaseSound
  private unlockAudio: Phaser.Sound.BaseSound
  private hurtTimeout: Phaser.Time.TimerEvent
  private hurtBackground: Phaser.GameObjects.Rectangle
  private isUpstairs = false
  private hasWaterCollector = false
  private hasWood = false
  private hasFire = false
  private hasCard = false
  private encounterHappened = false
  private cleanWound = false
  private isCured = false
  private boxOpen = false
  private ladderXPosition = 1130
  private ladderCutscene = false
  private timeout: number
  private bindHandleUnlock = this.handleUnlock.bind(this)

  constructor() {
    super({
      key: SCENES.BUILDING,
    })
  }

  public preload() {
    // Load common assets
    this.commonPreload()

    // Preload audio
    this.loadAudio(AUDIO.BIRDS)
    this.loadAudio(AUDIO.CRICKETS)
    this.loadAudio(AUDIO.ATTACK)
    this.loadAudio(AUDIO.FIRE)
    this.loadAudio(AUDIO.STATIC)
    this.loadAudio(AUDIO.DROP)
    this.loadAudio(AUDIO.BANG)
    this.loadAudio(AUDIO.ROCK)
    this.loadAudio(AUDIO.BROKEN_GLASS)
    this.loadAudio(AUDIO.BUCKET)
    this.loadAudio(AUDIO.PLACE)
    this.loadAudio(AUDIO.GROWL)
    this.loadAudio(AUDIO.GROWL2)
    this.loadAudio(AUDIO.UNLOCK)

    // Preload images
    this.loadImage(IMAGES.BUILDING_BG)
    this.loadImage(IMAGES.BUILDING_BG_2)
    this.loadImage(IMAGES.BUILDING_NIGHT_BG)
    this.loadImage(IMAGES.BUILDING_NIGHT_BG_2)
    this.loadImage(IMAGES.BUILDING_HILLS)
    this.loadImage(IMAGES.BUILDING_FOREST)
    this.loadImage(IMAGES.FLOOR)
    this.loadImage(IMAGES.WOOD)
    this.loadImage(IMAGES.CLOTH)
    this.loadImage(IMAGES.DROP)
    this.loadImage(IMAGES.ROCK)
    this.loadImage(IMAGES.BOTTLE)

    // Preload sprites
    this.loadSprite(SPRITES.METALBOX)
    this.loadSprite(SPRITES.LADDER)
    this.loadSprite(SPRITES.BUCKET)
    this.loadSprite(SPRITES.BOXES)
    this.loadSprite(SPRITES.ANTENNA)
    this.loadSprite(SPRITES.FIREPIT)
    this.loadSprite(SPRITES.BUGGY)
    this.loadSprite(SPRITES.STRANGER)
  }

  public async create() {
    if (localStorage.getItem('SCENE') === 'BUILDING') {
      document.dispatchEvent(new CustomEvent('startBuildingScene'))
    } else {
      localStorage.setItem('SCENE', 'BUILDING')
    }
    this.bgAudio = this.sound.add(AUDIO.BIRDS.KEY)

    this.bgAudio.play('', {
      loop: true,
    })

    this.initScene()
    document.addEventListener('unlock', this.bindHandleUnlock)

    this.fireAudio = this.sound.add(AUDIO.FIRE.KEY)
    this.staticAudio = this.sound.add(AUDIO.STATIC.KEY)
    this.dropAudio = this.sound.add(AUDIO.DROP.KEY)
    this.bangAudio = this.sound.add(AUDIO.BANG.KEY)
    this.rockAudio = this.sound.add(AUDIO.ROCK.KEY)
    this.nightAudio = this.sound.add(AUDIO.CRICKETS.KEY)
    this.attackAudio = this.sound.add(AUDIO.ATTACK.KEY)
    this.brokenGlassAudio = this.sound.add(AUDIO.BROKEN_GLASS.KEY)
    this.bucketAudio = this.sound.add(AUDIO.BUCKET.KEY)
    this.placeAudio = this.sound.add(AUDIO.PLACE.KEY)
    this.growlAudio = this.sound.add(AUDIO.GROWL.KEY)
    this.growl2Audio = this.sound.add(AUDIO.GROWL2.KEY)
    this.unlockAudio = this.sound.add(AUDIO.UNLOCK.KEY)

    const bg = this.add.image(0, 0, IMAGES.BUILDING_BG.KEY).setOrigin(0)
    this.nightBackground = this.add
      .image(0, 0, IMAGES.BUILDING_NIGHT_BG.KEY)
      .setOrigin(0)
      .setAlpha(0, 0, 0, 0)

    this.createClouds(200, 1)

    this.antennasSprites = this.physics.add.group({
      immovable: true,
      allowGravity: false,
    })

    this.antennasSprites.addMultiple([
      new Antenna({
        scene: this,
        x: 145,
        y: 265,
      }),
      new Antenna({
        scene: this,
        x: 10,
        y: 335,
      }),
      new Antenna({
        scene: this,
        x: 10,
        y: 335,
      })
        .setTintFill(0x9fb9b4)
        .setAlpha(0.3),
      new Antenna({
        scene: this,
        x: 280,
        y: 323,
      }),
      new Antenna({
        scene: this,
        x: 280,
        y: 323,
      })
        .setTintFill(0x9fb9b4)
        .setAlpha(0.5),
    ])

    this.antennasSprites.playAnimation('antennaBlink')

    this.forest = this.add
      .image(0, 0, IMAGES.BUILDING_FOREST.KEY)
      .setOrigin(0, 0)
      .setScrollFactor(0.95, 0.98)

    this.trees = this.add
      .tileSprite(300, 75, 820, 720, IMAGES.TREES.KEY)
      .setOrigin(0, 0)
      .setScrollFactor(0.9, 0.94)

    this.hills = this.add
      .tileSprite(0, -10, 820, 720, IMAGES.BUILDING_HILLS.KEY)
      .setOrigin(0, 0)
      .setScrollFactor(0.85, 0.9)

    this.add.image(0, 0, IMAGES.BUILDING_BG_2.KEY).setOrigin(0)
    this.nightForeground = this.add
      .image(0, 0, IMAGES.BUILDING_NIGHT_BG_2.KEY)
      .setOrigin(0)
      .setAlpha(0, 0, 0, 0)

    this.physics.world.setBounds(0, 0, this.WORLD.WIDTH, this.WORLD.HEIGHT)

    this.platforms = this.physics.add.staticGroup()

    const floor = this.platforms
      .create(0, 684, IMAGES.FLOOR.KEY, null, false)
      .setOrigin(0)
    floor.scaleX = bg.width / 30
    floor.refreshBody()

    this.platforms.create(680, 365, IMAGES.FLOOR.KEY, null, false)
    this.platforms.create(1278, 365, IMAGES.FLOOR.KEY, null, false)
    this.platforms.create(740, 425, IMAGES.FLOOR.KEY, null, false)

    this.upstairsFloor = this.platforms
      .create(710, 395, IMAGES.FLOOR.KEY, null, false)
      .setOrigin(0)
    this.upstairsFloor.scaleX = 9
    this.upstairsFloor.refreshBody()

    this.upstairsFloor.body.checkCollision.down = false

    this.ladder = new Ladder({
      scene: this,
      x: this.ladderXPosition,
      y: 532,
    })
    this.physics.add.collider(this.platforms, this.ladder)
    this.ladder.setInteractive()
    this.ladder.play('ladderDay')

    this.metalBox = new MetalBox({ scene: this, x: 1030, y: 660 })
    this.physics.add.collider(this.platforms, this.metalBox)
    this.metalBox.play('metalBoxDay')
    this.metalBox.setInteractive()

    this.rock = this.physics.add
      .staticImage(415, 624, IMAGES.ROCK.KEY)
      .refreshBody()
      .setInteractive()

    this.bottle = this.physics.add
      .staticImage(750, 677, IMAGES.BOTTLE.KEY)
      .refreshBody()
      .setInteractive()

    this.puddle = this.physics.add
      .staticImage(600, 700, IMAGES.FLOOR.KEY)
      .setScale(1.5, 0.9)
      .setAlpha(0, 0, 0, 0)
      .refreshBody()
      .setInteractive()

    this.pit = new Firepit({
      scene: this,
      x: 880,
      y: 653,
    })
    this.physics.add.collider(this.platforms, this.pit)
    this.pit.play('default')
    this.pit.setInteractive()

    this.wall = this.physics.add
      .staticImage(935, 540, IMAGES.FLOOR.KEY)
      .setScale(4, 2)
      .setAlpha(0, 0, 0, 0)
      .refreshBody()
      .setInteractive()

    this.antennas = this.physics.add
      .staticImage(180, 325, IMAGES.FLOOR.KEY)
      .setScale(5.8, 8)
      .setAlpha(0, 0, 0, 0)
      .refreshBody()
      .setInteractive()

    this.note = this.physics.add
      .staticImage(957, 685, IMAGES.NOTE.KEY)
      .refreshBody()
      .setInteractive()

    this.initSurvivor()

    this.initStranger()

    this.wood = this.physics.add
      .staticImage(820, 340, IMAGES.WOOD.KEY)
      .refreshBody()
      .setInteractive()

    this.boxes = new Boxes({
      scene: this,
      x: 771,
      y: 322,
    })
    this.boxes.play('boxesDay')

    this.drop = this.add.image(600, 428, IMAGES.DROP.KEY).setOrigin(0)

    this.dropAnimation = this.tweens.add({
      targets: this.drop,
      y: '+=250',
      ease: 'Linear',
      duration: 600,
      repeatDelay: 2000,
      repeat: -1, // infinity
      yoyo: false,
      onRepeat: () => {
        this.dropAudio.play({
          volume: 0.5,
        })
      },
    })

    this.bucket = new Bucket({
      scene: this,
      x: 1200,
      y: 660,
    })
    this.physics.add.collider(this.platforms, this.bucket)
    this.bucket.play('bucketDay')
    this.bucket.setInteractive()

    this.buggy = new Buggy({
      scene: this,
      x: 100,
      y: 600,
    })
    this.buggy.play('buggy-parked')
    this.physics.add.collider(this.platforms, this.buggy)
    this.buggy.setInteractive()

    this.grassForeground = this.add
      .tileSprite(0, 755, 820, 96, IMAGES.GRASS_FOREGROUND.KEY)
      .setOrigin(0, 0)
      .setScrollFactor(0, 1)

    this.setInteractions()

    this.wood.on('pointerdown', () => {
      if (!this.encounterHappened && this.isUpstairs) {
        this.startEncounter()
      }
    })

    this.cameras.main.setBounds(0, 0, this.WORLD.WIDTH, this.WORLD.HEIGHT)
    cameraFade(this, 'fadeIn')

    await timer(this, 700)
    await cameraPan(this, this.survivor.x, this.survivor.y, 4000)
    this.cameras.main.startFollow(this.survivor)
    this.initCutscene()
  }

  public update() {
    this.grassForeground.tilePositionX = this.cameras.main.scrollX * 1.2
    this.physics.world.gravity.y = 800
    this.survivor.update()
  }

  private async initCutscene() {
    this.startGame()
    await this.createDialog(
      "Hm, doesn't look like anyone has been here for some time, but I bet I can find something useful lying around. I should start a fire and find some water, I'm running low"
    )
    this.pickUp('page-8')
  }

  private initSurvivor() {
    this.survivor = new Survivor({
      scene: this,
      x: 300,
      y: 625,
    })

    this.physics.add.collider(
      this.platforms,
      this.survivor,
      (survivor: Survivor, platform: Physics.Arcade.Sprite) => {
        if (platform.y > 600 && this.isUpstairs) {
          this.survivor.play('stand')
          this.isUpstairs = false
          this.ladderCutscene = false
          this.sys.events.off(
            this.interact.ladder.key,
            this.interact.ladder.cb,
            this,
            false
          )
        } else if (survivor.body.y < 350 && !this.isUpstairs) {
          this.survivor.play('stand')
          this.isUpstairs = true
          this.ladderCutscene = false
          this.sys.events.off(
            this.interact.ladder.key,
            this.interact.ladder.cb,
            this,
            false
          )
        }
      }
    )

    this.setupInput()
  }

  private initStranger() {
    this.stranger = new Stranger({
      scene: this,
      x: 750,
      y: 340,
    })
    this.stranger.setInteractive()
    this.physics.add.collider(this.platforms, this.stranger)
  }

  private startEncounter() {
    this.startCutscene()
    this.finishInteraction()
    this.survivor.stop()
    this.encounterHappened = true

    this.stranger.anims.play('strangerWalk')

    this.survivor.moveTo(1000, 'left').then(() => {
      this.tweens.add({
        targets: this.stranger,
        x: 820,
        duration: 1000,
        onComplete: async () => {
          this.stranger.anims.play('strangerStand')
          this.growlAudio.play({ volume: 0.2 })
          await this.createDialog('* Growl *', false)
          await this.createDialog('Oh… Hello', false)

          this.stranger.anims.play('strangerWalk')

          this.tweens.add({
            targets: this.stranger,
            x: 880,
            duration: 1000,
            onComplete: async () => {
              this.stranger.anims.play('strangerStand')
              this.growl2Audio.play({ volume: 0.2 })
              await this.createDialog('* Growl *', false)
              await this.createDialog(
                "Uhm… I'm sorry, I thought the place was abandoned, my car broke down and… eh…",
                false
              )
              await this.survivor.moveTo(1050, 'left')
              await this.createDialog("I don't think I can reason with him.")
              this.survivor.immobilize()

              this.timeout = setTimeout(() => {
                this.strangerAttack().then(() => {
                  this.endGame()
                })
              }, 10000)
            },
          })
        },
      })
    })
  }

  private strangerAttack() {
    return new Promise((resolve) => {
      this.tweens.add({
        targets: this.stranger,
        x: 1050,
        duration: 10,
      })
      this.stranger.anims.play('strangerFight')
      this.survivor.play('fight')

      this.bangAudio.play({ volume: 0.8 })
      this.attackAudio.play({ volume: 0.7 })
      this.cameras.main.flash(500, 255, 0, 0, true, (_, progress) => {
        if (progress === 1) {
          resolve()
        }
      })
    })
  }

  private finishEncounter() {
    clearTimeout(this.timeout)

    this.strangerAttack().then(async () => {
      await timer(this, 3000)
      this.cloth = this.physics.add
        .staticImage(970, 392, IMAGES.CLOTH.KEY)
        .refreshBody()
        .setInteractive()
      this.setupEvent('cloth')

      this.staticAudio.play()
      this.stranger.anims.play('strangerFlee')
      this.survivor.play('getUp')
      this.tweens.add({
        targets: this.stranger,
        x: 0,
        duration: 1000,
        onComplete: async () => {
          this.stranger.destroy()
          document.dispatchEvent(new CustomEvent('getHurt'))
          await this.createDialog(
            '... What did just happen? Was that my radio?'
          )
          this.survivor.recover()
          await this.createDialog(
            "Ugh… No time to think about that, I'm losing a lot of blood."
          )
          this.startHurtEffect()
        },
      })
    })
  }

  private startHurtEffect() {
    if (!this.hurtBackground) {
      this.hurtBackground = this.add
        .rectangle(0, 0, this.WORLD.WIDTH, this.WORLD.HEIGHT, 0x961812)
        .setAlpha(0)
        .setOrigin(0, 0)
        .setScrollFactor(0)
    }

    this.tweens.add({
      targets: this.hurtBackground,
      alpha: { from: 0, to: 0.5 },
      ease: 'Linear',
      duration: 600,
      repeat: 0,
      yoyo: true,
    })

    this.hurtTimeout = this.time.addEvent({
      delay: 5000,
      callback: () => {
        this.startHurtEffect()
      },
    })
  }

  private stopHurtEffect() {
    this.hurtTimeout.destroy()
    this.hurtBackground.destroy()
  }

  private interactBucket() {
    this.finishInteraction()
    if (!this.playingCutscene) {
      if (this.hasWaterCollector) {
        this.interactPuddle()
      } else {
        this.survivor.stop()

        this.bucketAudio.play()

        this.createDialog('A bucket. Convenient.')

        this.pickUp('bucket')

        this.bucket.setVisible(false)
        this.interactKeys = this.interactKeys.filter((key) => key !== 'bucket')
      }
    }
  }

  private interactWood() {
    if (!this.playingCutscene) {
      this.survivor.stop()
      this.finishInteraction()
      this.createDialog('Dry wood, lucky me!')

      this.pickUp('wood')

      this.wood.destroy()
    }
  }

  private interactLadder() {
    this.finishInteraction()
    if (!this.ladderCutscene) {
      this.ladderCutscene = true
      this.survivor.setDestination(this.ladderXPosition)
    }
    if (
      this.ladderCutscene &&
      !this.playingCutscene &&
      this.survivor.x > this.ladderXPosition - 5 &&
      this.survivor.x < this.ladderXPosition + 5
    ) {
      if (this.survivor.body.velocity.x !== 0) {
        this.survivor.stop()
      }
      if (
        !this.survivor.anims.currentAnim ||
        this.survivor.anims.currentAnim.key !== 'climbing'
      ) {
        this.survivor.play('climbing')
      }
      if (this.isUpstairs) {
        this.upstairsFloor.body.checkCollision.up = false
        this.survivor.body.setVelocityY(400)
      } else {
        this.upstairsFloor.body.checkCollision.up = true
        this.physics.world.gravity.y = 0
        this.survivor.body.setVelocityY(-400)
      }
    }
  }

  private async setUpWaterCollector() {
    this.startCutscene()
    await this.survivor.moveTo(650, 'left')
    if (!this.hasWaterCollector) {
      this.survivor.stop()
      this.removeItem({ id: 'bucket' })
      this.placeAudio.play({ volume: 0.2 })
      this.bucket.setPosition(605, 660)
      this.bucket.setVisible(true)
      await this.createDialog('Water collector set!')
      this.hasWaterCollector = true
      this.checkIfFinished()
    }
  }

  private async addWood() {
    this.startCutscene()
    await this.survivor.moveTo(885, 'left')
    if (!this.hasWood) {
      this.survivor.stop()
      this.removeItem({ id: 'wood' })
      this.pit.play('wood')
      await this.createDialog('Now I need something to start the fire.')
      this.hasWood = true
    }
  }

  private async setUpFire() {
    this.startCutscene()
    await this.survivor.moveTo(885, 'left')
    if (!this.hasWood) {
      return this.createDialog('I need something to burn first.')
    }
    if (!this.hasFire) {
      this.survivor.stop()
      this.removeItem({ id: 'brokenGlass' })
      this.fireAudio.play({ loop: true })
      this.pit.play('burning')
      await this.createDialog('Fire is burning!')
      this.hasFire = true
      this.checkIfFinished()
    }
  }

  private interactPuddle() {
    this.finishInteraction()
    if (this.hasWaterCollector) {
      this.createDialog('It will be full in a while.')
    } else {
      this.createDialog('So much water lost...')
    }
  }

  private interactWall() {
    this.finishInteraction()
    this.createDialog(
      'Someone has written the name "Libby" all over the wall... Geez, what a creep.'
    )
  }

  private interactPit() {
    this.finishInteraction()
    if (this.hasFire) {
      this.createDialog('It should last all night.')
    } else {
      this.createDialog(
        'Perfect place to build a fire, if I can find something to burn'
      )
    }
  }

  private async interactAntennas() {
    this.finishInteraction()
    this.startCutscene()
    this.cameras.main.stopFollow()
    await cameraPan(this, 0, 0, 1000)
    await this.createDialog(
      'Hmm, looks like they are active. I wonder what they are for.'
    )
    await cameraPan(this, this.survivor.x, this.survivor.y, 1000)
    this.cameras.main.startFollow(this.survivor)
    this.stopCutscene()
  }

  private interactBuggy() {
    this.finishInteraction()
    this.createDialog('Not much more I can do to fix it today.')
  }

  private interactRock() {
    this.finishInteraction()
    this.createDialog("I don't want to carry a rock around.")
  }

  private interactCloth() {
    if (!this.playingCutscene) {
      this.finishInteraction()
      this.survivor.stop()

      this.createDialog(
        "A piece of cloth from the stranger's labcoat. There's something attached to it."
      )

      this.pickUp('cloth')
      this.pickUp('idCard')
      this.hasCard = true

      this.cloth.destroy()
    }
  }

  private async interactBox() {
    if (!this.playingCutscene) {
      this.survivor.stop()
      this.finishInteraction()

      if (this.boxOpen) {
        return this.createDialog("It's empty.")
      }

      if (this.hasCard) {
        await this.createDialog(
          "Medical supplies should be in there! Might this belong to that guy? Let's see if I can figure out the code."
        )
        document.dispatchEvent(new CustomEvent('showLock'))
      } else {
        this.createDialog(
          "Seems to be a box of medical supplies, but it's locked. I need a 4 digit code."
        )
      }
    }
  }

  private interactBottle() {
    if (!this.playingCutscene) {
      this.survivor.stop()
      this.finishInteraction()

      this.createDialog("A heavy glass bottle. It's empty.")

      this.pickUp('bottle')

      this.bottle.destroy()
    }
  }

  private breakBottle() {
    this.startCutscene()
    this.survivor.setDestination(390)
    this.physics.moveTo(this.survivor, 415, this.survivor.y, 100)

    const crackBottle = async () => {
      this.sys.events.off('crackBottle', crackBottle, this, false)
      this.survivor.stop()
      this.survivor.play('backwards')
      this.rockAudio.play()
      await timer(this, 1000)
      this.brokenGlassAudio.play()
      this.removeItem({ id: 'bottle' })
      this.pickUp('brokenGlass')
      this.createDialog('Now I have a nice piece of thick, curved glass.')
      this.survivor.play('stand')
    }

    this.sys.events.on('crackBottle', crackBottle, this)
    this.physics.add.overlap(this.survivor, this.rock, () => {
      this.sys.events.emit('crackBottle')
    })
  }

  private getNuts() {
    this.startCutscene()
    this.survivor.setDestination(390)
    this.physics.moveTo(this.survivor, 415, this.survivor.y, 100)

    const crackNuts = () => {
      this.sys.events.off('crackNuts', crackNuts, this, false)
      this.survivor.stop()
      this.rockAudio.play()
      this.removeItem({ id: 'pinecone' })
      this.pickUp('nuts')
      this.createDialog('Yes! Delicious pine nuts')
    }

    this.sys.events.on('crackNuts', crackNuts, this)
    this.physics.add.overlap(this.survivor, this.rock, () => {
      this.sys.events.emit('crackNuts')
    })
  }

  private handleUnlock() {
    this.unlockAudio.play()
    this.boxOpen = true
    this.createDialog(
      "Yes! There's some solution to clean my wound. Also a small key."
    )
    document.removeEventListener('unlock', this.bindHandleUnlock)
  }

  private async interactNote() {
    this.finishInteraction()
    if (!this.playingCutscene) {
      this.survivor.stop()

      this.note.destroy()

      await this.createDialog(
        "I'll add this to my notebook. Looks like a ration card, back when the economy collapsed it was the only way to prevent hoarding and ensure everyone had something to eat."
      )

      this.pickUp('page-9')

      this.sys.events.off(
        this.interact.note.key,
        this.interact.note.cb,
        this,
        false
      )
    }
  }

  private checkIfFinished() {
    const isFinished = this.hasFire && this.hasWaterCollector && this.isCured

    if (isFinished) {
      this.initEndCutscene()
    }
  }

  private setNightMode() {
    Phaser.Actions.Call(
      this.clouds.getChildren(),
      (cloud: Phaser.GameObjects.Sprite) => {
        this.clouds.killAndHide(cloud)
      },
      this
    )
    this.forest.destroy()
    this.trees.destroy()
    this.hills.destroy()
    this.buggy.destroy()
    this.rock.destroy()
    this.grassForeground.destroy()
    this.nightBackground.setAlpha(1, 1, 1, 1)
    this.nightForeground.setAlpha(1, 1, 1, 1)
    this.antennasSprites.playAnimation('antennaNightBlink')
    const antennas = this.antennasSprites.getChildren() as Antenna[]
    antennas[2].setTintFill(0x222034)
    antennas[4].setTintFill(0x222034)
    this.metalBox.play('metalBoxNight')
    this.boxes.play('boxesNight')
    this.bucket.play('bucketNight')
    this.ladder.play('ladderNight')
  }

  private async initEndCutscene() {
    await this.createDialog(
      'Ok, I have everything ready to spend the night now, should be safe.',
      false
    )
    this.startCutscene()
    await cameraFade(this, 'fadeOut')
    this.bgAudio.stop()
    this.nightAudio.play('', { loop: true })
    this.setNightMode()
    this.tweens.add({
      targets: this.survivor,
      x: 950,
      duration: 10,
    })
    this.survivor.faceLeft()
    await cameraFade(this, 'fadeIn')
    await timer(this, 700)
    this.cameras.main.stopFollow()
    await cameraPan(this, 0, 0, 4000)
    await this.createDialog(
      "How strange, to see northern lights so far down south. I wonder if there is some electromagnetic anomaly around here… could explain why the buggy's electrical system died.",
      false
    )
    await cameraPan(this, this.survivor.x, this.survivor.y, 4000)
    await this.createDialog(
      "Anyway… I should get some rest now. Tomorrow I'll head into town and see if I can find out what the hell is going on.",
      false
    )
    await cameraFade(this, 'fadeOut', 2000)
    this.finishScene()
    document.dispatchEvent(new CustomEvent('completeGame'))
  }
}

export default BuildingScene
