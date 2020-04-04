import { SCENES, IMAGES, AUDIO } from '../constants'
import Survivor from '../sprites/Survivor'
import { Physics } from 'phaser'
import {
  loadSurvivor,
  setupInput,
  preloadBuggy,
  preloadSurvivor,
  preloadStranger
} from '../utils/load'
import { cameraFade, cameraPan, timer } from '../utils/promisify'
import { BaseScene } from './BaseScene'
import { randomLine } from '../default-lines'
import Buggy from '../sprites/Buggy'
import Stranger from '../sprites/Stranger'
import Firepit from '../sprites/Firepit'
import Antenna from '../sprites/Antenna'
import Boxes from '../sprites/Boxes'

class BuildingScene extends BaseScene {
  public use = {
    ...this.use,
    survivor: {
      setText: null,
      name: 'Survivor',
      use: () => {
        // copied from base scene. should unify somewhere
        this.interactingWithObject = true
        if (this.currentObject.consumable) {
          document.dispatchEvent(
            new CustomEvent('consume', {
              detail: { id: this.currentObject.id }
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
            this.removeItem({ id: 'cloth' })
            return this.createDialog(
              'Good, that should stop the bleeding for now.'
            ).then(() => {
              this.isCured = true
              return this.checkIfFinished()
            })
          }
          return this.createDialog('I should clean up the wound first.')
        }

        if (this.currentObject.id === 'solution') {
          this.cleanWound = true
          this.removeItem({ id: 'solution' })
          return this.createDialog(
            'Wound is now clean, I should cover it as soon as possible'
          )
        }

        return this.createDialog(randomLine())
      }
    },
    buggy: {
      setText: null,
      name: 'Buggy',
      use: () => {
        this.interactingWithObject = true
        return this.createDialog(randomLine())
      }
    },
    ladder: {
      setText: null,
      name: 'Ladder',
      use: () => {
        this.interactingWithObject = true
        return this.createDialog(randomLine())
      }
    },
    bucket: {
      setText: null,
      name: 'Bucket',
      use: () => {
        this.interactingWithObject = true
        return this.createDialog(randomLine())
      }
    },
    puddle: {
      setText: null,
      name: 'Puddle',
      use: () => {
        this.interactingWithObject = true
        if (this.currentObject.id === 'bucket') {
          return this.setUpWaterCollector()
        }
        return this.createDialog(randomLine())
      }
    },
    wall: {
      setText: null,
      name: 'Wall',
      use: () => {
        this.interactingWithObject = true
        return this.createDialog(randomLine())
      }
    },
    pit: {
      setText: null,
      name: 'Fire pit',
      use: () => {
        this.interactingWithObject = true
        if (this.currentObject.id === 'wood') {
          return this.setUpFire()
        }
        return this.createDialog(randomLine())
      }
    },
    wood: {
      setText: null,
      name: 'Wood',
      use: () => {
        this.interactingWithObject = true
        return this.createDialog(randomLine())
      }
    },
    rock: {
      setText: null,
      name: 'Rock',
      use: () => {
        this.interactingWithObject = true
        if (this.currentObject.id === 'pinecone') {
          return this.getNuts()
        }
        return this.createDialog(randomLine())
      }
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
      }
    }
  }

  public interact = {
    buggy: {
      key: 'interactBuggy',
      text: 'Look at buggy',
      cb: this.interactBuggy
    },
    bucket: {
      key: 'interactBucket',
      text: 'Pick up bucket',
      cb: this.interactBucket
    },
    ladder: {
      key: 'interactLadder',
      text: 'Use ladder',
      cb: this.interactLadder,
      permanent: true
    },
    wood: {
      key: 'interactWood',
      text: 'Pick up wood',
      cb: this.interactWood
    },
    rock: {
      key: 'interactRock',
      text: 'Pick up rock',
      cb: this.interactRock
    },
    puddle: {
      key: 'interactPuddle',
      text: 'Look at puddle',
      cb: this.interactPuddle
    },
    wall: {
      key: 'interactWall',
      text: 'Look at wall',
      cb: this.interactWall
    },
    pit: {
      key: 'interactPit',
      text: 'Look at pit',
      cb: this.interactPit
    },
    antennas: {
      key: 'interactAntennas',
      text: 'Look at antennas',
      cb: this.interactAntennas
    },
    cloth: {
      key: 'interactCloth',
      text: 'Pick up cloth',
      cb: this.interactCloth
    },
    metalBox: {
      key: 'interactBox',
      text: 'Look at box',
      cb: this.interactBox
    }
  }

  public survivor: Survivor
  private buggy: Buggy
  private stranger: Stranger
  private nightBackground: Phaser.GameObjects.Image
  private nightForeground: Phaser.GameObjects.Image
  private platforms: Physics.Arcade.StaticGroup
  private upstairsFloor: Physics.Arcade.Sprite
  private floor: Physics.Arcade.Sprite
  private ladder: Physics.Arcade.Image
  private bucket: Physics.Arcade.Image
  private boxes: Boxes
  private waterCollector: Physics.Arcade.Image
  private wood: Physics.Arcade.Image
  private puddle: Physics.Arcade.Image
  private pit: Firepit
  private wall: Physics.Arcade.Image
  private antennas: Physics.Arcade.Image
  private antennasSprites: Physics.Arcade.Group
  private rock: Physics.Arcade.Image
  private cloth: Physics.Arcade.Image
  private metalBox: Physics.Arcade.Image
  private drop: Phaser.GameObjects.Image
  private dropAnimation: Phaser.Tweens.Tween
  private isUpstairs = false
  private hasWaterCollector = false
  private hasFire = false
  private hasCard = false
  private encounterHappened = false
  private cleanWound = false
  private isCured = false
  private boxOpen = false
  private fireAudio: Phaser.Sound.BaseSound
  private staticAudio: Phaser.Sound.BaseSound
  private dropAudio: Phaser.Sound.BaseSound
  private bangAudio: Phaser.Sound.BaseSound
  private timeout: number

  constructor() {
    super({
      key: SCENES.BUILDING
    })
  }

  public preload() {
    this.load.audio(AUDIO.FIRE.KEY, `/sound/${AUDIO.FIRE.FILE}`)
    this.load.audio(AUDIO.STATIC.KEY, `/sound/${AUDIO.STATIC.FILE}`)
    this.load.audio(AUDIO.DROP.KEY, `/sound/${AUDIO.DROP.FILE}`)
    this.load.audio(AUDIO.BANG.KEY, `/sound/${AUDIO.BANG.FILE}`)
    this.load.image(
      IMAGES.BUILDING_BG.KEY,
      `/images/${IMAGES.BUILDING_BG.FILE}`
    )
    this.load.image(
      IMAGES.BUILDING_BG_2.KEY,
      `/images/${IMAGES.BUILDING_BG_2.FILE}`
    )
    this.load.image(
      IMAGES.BUILDING_NIGHT_BG.KEY,
      `/images/${IMAGES.BUILDING_NIGHT_BG.FILE}`
    )
    this.load.image(
      IMAGES.BUILDING_NIGHT_BG_2.KEY,
      `/images/${IMAGES.BUILDING_NIGHT_BG_2.FILE}`
    )
    this.load.image(IMAGES.FLOOR.KEY, `/images/${IMAGES.FLOOR.FILE}`)
    this.load.image(IMAGES.LADDER.KEY, `/images/${IMAGES.LADDER.FILE}`)
    this.load.image(IMAGES.BUCKET.KEY, `/images/${IMAGES.BUCKET.FILE}`)
    this.load.image(IMAGES.WOOD.KEY, `/images/${IMAGES.WOOD.FILE}`)
    this.load.image(IMAGES.CLOTH.KEY, `/images/${IMAGES.CLOTH.FILE}`)
    this.load.image(IMAGES.DROP.KEY, `/images/${IMAGES.DROP.FILE}`)
    this.load.image(IMAGES.ROCK.KEY, `/images/${IMAGES.ROCK.FILE}`)
    this.load.image(IMAGES.METALBOX.KEY, `/images/${IMAGES.METALBOX.FILE}`)
    this.load.spritesheet(IMAGES.BOXES.KEY, `/images/${IMAGES.BOXES.FILE}`, {
      frameWidth: 128,
      frameHeight: 148
    })
    this.load.spritesheet(
      IMAGES.ANTENNA.KEY,
      `/images/${IMAGES.ANTENNA.FILE}`,
      {
        frameWidth: 160,
        frameHeight: 504
      }
    )
    this.load.spritesheet(
      IMAGES.FIREPIT.KEY,
      `/images/${IMAGES.FIREPIT.FILE}`,
      {
        frameWidth: 84,
        frameHeight: 60
      }
    )
    preloadBuggy(this)
    preloadSurvivor(this)
    preloadStranger(this)
  }

  public async create() {
    this.initScene()
    document.addEventListener('unlock', this.handleUnlock.bind(this))

    this.fireAudio = this.sound.add(AUDIO.FIRE.KEY)
    this.staticAudio = this.sound.add(AUDIO.STATIC.KEY)
    this.dropAudio = this.sound.add(AUDIO.DROP.KEY)
    this.bangAudio = this.sound.add(AUDIO.BANG.KEY)

    const bg = this.add.image(0, 0, IMAGES.BUILDING_BG.KEY).setOrigin(0)
    this.nightBackground = this.add
      .image(0, 0, IMAGES.BUILDING_NIGHT_BG.KEY)
      .setOrigin(0)
      .setAlpha(0, 0, 0, 0)

    this.antennasSprites = this.physics.add.group({
      immovable: true,
      allowGravity: false
    })

    this.antennasSprites.addMultiple([
      new Antenna({
        scene: this,
        x: 145,
        y: 265,
        key: IMAGES.ANTENNA.KEY
      }),
      new Antenna({
        scene: this,
        x: 10,
        y: 335,
        key: IMAGES.ANTENNA.KEY
      }).setAlpha(0.5, 0.5, 0.5, 0.5),
      new Antenna({
        scene: this,
        x: 280,
        y: 323,
        key: IMAGES.ANTENNA.KEY
      }).setAlpha(0.5, 0.5, 0.5, 0.5)
    ])

    this.antennasSprites.playAnimation('antennaBlink')

    this.add.image(0, 0, IMAGES.BUILDING_BG_2.KEY).setOrigin(0)
    this.nightForeground = this.add
      .image(0, 0, IMAGES.BUILDING_NIGHT_BG_2.KEY)
      .setOrigin(0)
      .setAlpha(0, 0, 0, 0)

    this.physics.world.setBounds(0, 0, bg.width, bg.height)

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

    this.ladder = this.physics.add
      .staticImage(1130, 532, IMAGES.LADDER.KEY)
      .refreshBody()
      .setInteractive()

    this.metalBox = this.physics.add
      .staticImage(1030, 660, IMAGES.METALBOX.KEY)
      .refreshBody()
      .setInteractive()

    this.bucket = this.physics.add
      .staticImage(1200, 660, IMAGES.BUCKET.KEY)
      .refreshBody()
      .setInteractive()

    this.rock = this.physics.add
      .staticImage(415, 625, IMAGES.ROCK.KEY)
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
      key: IMAGES.FIREPIT.KEY
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
      key: IMAGES.BOXES.KEY
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
          volume: 0.5
        })
      }
    })

    this.buggy = new Buggy({
      scene: this,
      key: IMAGES.BUGGY.KEY,
      x: 100,
      y: 600
    })
    this.buggy.play('buggy-parked')
    this.physics.add.collider(this.platforms, this.buggy)
    this.buggy.setInteractive()

    this.setInteractions([
      'bucket',
      'ladder',
      'wood',
      'puddle',
      'wall',
      'pit',
      'antennas',
      'buggy',
      'rock',
      'metalBox'
    ])

    this.wood.on('pointerup', () => {
      if (!this.encounterHappened && this.isUpstairs) {
        this.startEncounter()
      }
    })

    this.cameras.main.setBounds(0, 0, 1280, 800)
    cameraFade(this, 'fadeIn')

    await timer(this, 700)
    await cameraPan(this, this.survivor.x, this.survivor.y, 4000)
    this.cameras.main.startFollow(this.survivor)

    this.initCutscene()
  }

  public update() {
    this.physics.world.gravity.y = 800
    this.survivor.update()
  }

  private initCutscene() {
    this.createDialog(
      "Hm, doesn't look like anyone is been here for some time, but I bet I can find something useful lying around. I should start a fire and find some food and water, I'm running low"
    )
    this.startGame()
  }

  private initSurvivor() {
    this.survivor = loadSurvivor(this, 300, 625)

    this.physics.add.collider(
      this.platforms,
      this.survivor,
      (survivor: Survivor, platform: Physics.Arcade.Sprite) => {
        if (platform.y > 600 && this.isUpstairs) {
          this.survivor.play('stand')
          this.isUpstairs = false
          this.sys.events.off(
            this.interact.ladder.key,
            this.interact.ladder.cb,
            this,
            false
          )
        } else if (survivor.body.y < 350 && !this.isUpstairs) {
          this.survivor.play('stand')
          this.isUpstairs = true
          this.sys.events.off(
            this.interact.ladder.key,
            this.interact.ladder.cb,
            this,
            false
          )
        }
      }
    )

    setupInput(this.survivor, this)
  }

  private initStranger() {
    this.stranger = new Stranger({
      scene: this,
      key: IMAGES.STRANGER.KEY,
      x: 750,
      y: 340
    })
    this.stranger.setInteractive()
    this.physics.add.collider(this.platforms, this.stranger)
  }

  private startEncounter() {
    this.survivor.stop()
    this.startCutscene()
    this.encounterHappened = true

    this.survivor.moveTo(1000, 'left').then(() => {
      this.tweens.add({
        targets: this.stranger,
        x: 820,
        duration: 1000,
        onComplete: async () => {
          await this.createDialog('* Growl *', false)
          await this.createDialog('Oh… Hello', false)

          this.tweens.add({
            targets: this.stranger,
            x: 880,
            duration: 1000,
            onComplete: async () => {
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
            }
          })
        }
      })
    })
  }

  private strangerAttack() {
    return new Promise(resolve => {
      this.tweens.add({
        targets: this.stranger,
        x: 1000,
        duration: 10
      })
      this.bangAudio.play()
      this.cameras.main.flash(500, 255, 0, 0, true, (_, progress) => {
        if (progress === 1) {
          this.survivor.play('fight')
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
      this.survivor.play('getUp')
      this.tweens.add({
        targets: this.stranger,
        x: 0,
        duration: 1000,
        onComplete: async () => {
          this.stranger.destroy()
          document.dispatchEvent(new CustomEvent('getHurt'))
          await this.createDialog('... What did just happen?')
          this.survivor.recover()
          await this.createDialog(
            "Ugh… No time to think about that, I'm losing a lot of blood."
          )
        }
      })
    })
  }

  private interactBucket() {
    if (!this.playingCutscene) {
      this.survivor.stop()

      this.createDialog('A bucket. Convenient.')

      this.pickUp('bucket')

      this.bucket.destroy()
    }
  }

  private interactWood() {
    if (!this.playingCutscene) {
      this.survivor.stop()

      this.createDialog('Dry wood, lucky me!')

      this.pickUp('wood')

      this.wood.destroy()
    }
  }

  private interactLadder() {
    if (!this.playingCutscene) {
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
      this.waterCollector = this.physics.add
        .staticImage(605, 665, IMAGES.BUCKET.KEY)
        .refreshBody()
        .setInteractive()
      await this.createDialog('Water collector set!')
      this.hasWaterCollector = true
      this.checkIfFinished()
    }
  }

  private async setUpFire() {
    this.startCutscene()
    await this.survivor.moveTo(885, 'left')
    if (!this.hasFire) {
      this.survivor.stop()
      this.removeItem({ id: 'wood' })
      this.fireAudio.play({ loop: true })
      this.pit.play('burning')
      await this.createDialog('Fire is burning!')
      this.hasFire = true
      this.checkIfFinished()
    }
  }

  private interactPuddle() {
    if (this.hasWaterCollector) {
      this.createDialog('It will be full in a while.')
    } else {
      this.createDialog('So much water lost...')
    }
  }

  private interactWall() {
    this.createDialog(
      'Someone has written the name "Libby" all over the wall... Geez, what a creep.'
    )
  }

  private interactPit() {
    if (this.hasFire) {
      this.createDialog('It should last all night.')
    } else {
      this.createDialog(
        'Perfect place to build a fire, if I can find something to burn'
      )
    }
  }

  private async interactAntennas() {
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
    this.createDialog('Not much more I can do to fix it today.')
  }

  private interactRock() {
    this.createDialog("I don't want to carry a rock around.")
  }

  private interactCloth() {
    if (!this.playingCutscene) {
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

      if (this.boxOpen) {
        return this.createDialog("It's empty.")
      }

      if (this.hasCard) {
        await this.createDialog("Let's see if I can figure this out")
        document.dispatchEvent(new CustomEvent('showLock'))
      } else {
        this.createDialog("It's locked. I need a 4 digit code.")
      }
    }
  }

  private getNuts() {
    this.startCutscene()
    this.survivor.setDestination(415)
    this.physics.moveTo(this.survivor, 415, this.survivor.y, 100)

    const crackNuts = () => {
      this.survivor.stop()
      this.removeItem({ id: 'pinecone' })
      this.pickUp('nuts')
      this.createDialog('Yes! Delicious pine nuts')

      this.sys.events.off('crackNuts', crackNuts, this, false)
    }

    this.sys.events.on('crackNuts', crackNuts, this)
    this.physics.add.overlap(this.survivor, this.rock, () => {
      this.sys.events.emit('crackNuts')
    })
  }

  private handleUnlock() {
    this.boxOpen = true
    this.createDialog(
      "Yes! There's some solution to clean my wound. Also a small key."
    )
    document.removeEventListener('unlock', this.handleUnlock.bind(this))
  }

  private checkIfFinished() {
    const isFinished = this.hasFire && this.hasWaterCollector && this.isCured

    if (isFinished) {
      this.initEndCutscene()
    }
  }

  private async initEndCutscene() {
    await this.createDialog(
      'Ok, I have everything ready to spend the night now, should be safe.',
      false
    )
    this.startCutscene()
    await cameraFade(this, 'fadeOut')
    this.nightBackground.setAlpha(1, 1, 1, 1)
    this.nightForeground.setAlpha(1, 1, 1, 1)
    this.boxes.play('boxesNight')
    this.tweens.add({
      targets: this.survivor,
      x: 950,
      duration: 10
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
    document.dispatchEvent(new CustomEvent('completeGame'))
  }
}

export default BuildingScene
