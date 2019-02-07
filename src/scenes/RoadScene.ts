import { SCENES, IMAGES, AUDIO } from '../constants'
import Survivor from '../sprites/Survivor'
import Buggy from '../sprites/Buggy'
import createSpeechBubble from '../utils/createSpeechBubble'
import BuildingScene from './BuildingScene'
import { Physics } from 'phaser'

class RoadScene extends Phaser.Scene {
  survivor: Survivor
  buggy: Buggy
  floor: Physics.Arcade.Image
  roadsign: Physics.Arcade.Image
  engine: any
  playingCutscene = true

  look = {
    sign: {
      key: 'lookSign',
      cb: this.lookAtSign
    },
    buggy: {
      key: 'lookBuggy',
      cb: this.lookAtBuggy
    }
  }

  constructor() {
    super({
      key: SCENES.ROAD
    })
  }

  initCutscene() {
    this.buggy = new Buggy({
      scene: this,
      key: IMAGES.BUGGY.KEY,
      x: 1000,
      y: 359
    })
    this.physics.add.collider(this.floor, this.buggy)

    this.buggy.setInteractive()
    this.buggy.on('pointerup', () => {
      this.sys.events.on(this.look.buggy.key, this.look.buggy.cb, this)
    })

    this.buggy.play('buggy-driving')

    this.tweens.add({
      targets: this.buggy,
      x: 200,
      ease: 'Power1',
      duration: 3000,
      yoyo: false,
      repeat: 0,
      onComplete: () => {
        createSpeechBubble(
          {
            width: 100,
            height: 80,
            quote: 'What the…?'
          },
          this.buggy.body,
          this
        ).then(() => {
          this.buggy.play('buggy-parked')
          this.initEngine()
          this.initSurvivor()
          this.playingCutscene = false
        })
      }
    })
  }

  initSurvivor() {
    this.survivor = new Survivor({
      scene: this,
      key: IMAGES.SURVIVOR.KEY,
      x: 100,
      y: 346
    })
    this.anims.create({
      key: 'walk',
      frames: this.anims.generateFrameNumbers(IMAGES.SURVIVOR.KEY, {
        start: 0,
        end: 3
      }),
      frameRate: 7,
      repeat: -1
    })
    this.physics.add.collider(this.floor, this.survivor)
    this.physics.add.overlap(this.survivor, this.roadsign, () => {
      this.sys.events.emit(this.look.sign.key)
    })

    // this should be with the buggy engine instead
    this.physics.add.overlap(this.survivor, this.buggy, () => {
      this.sys.events.emit(this.look.buggy.key)
    })

    this.input.on('pointerdown', pointer => {
      if (this.playingCutscene === false) {
        this.survivor.setDestination(pointer.downX)
        this.physics.moveTo(this.survivor, pointer.downX, this.survivor.y, 100)
      }
    })
  }

  initEngine() {
    // should create an invisible shape on top of the engine area of the buggy
  }

  lookAtSign() {
    this.survivor.stop()

    createSpeechBubble(
      {
        width: 300,
        height: 80,
        quote: 'It reads something like… P A … S'
      },
      this.survivor.body,
      this
    )

    this.sys.events.off(this.look.sign.key, this.look.sign.cb, this, false)
  }

  lookAtBuggy() {
    this.survivor.stop()
    this.sys.events.off(this.look.buggy.key, this.look.buggy.cb, this, false)

    // turn this into stream or something
    createSpeechBubble(
      {
        width: 300,
        height: 160,
        quote:
          "Hmm that's weird. Nothing seems to be wrong with the engine, it's just not getting any power, the battery is completely dead."
      },
      this.survivor.body,
      this
    )
      .then(() =>
        createSpeechBubble(
          {
            width: 300,
            height: 160,
            quote:
              "Uh, it doesn't look like something that I can fix today. It's getting late so I should find some place to rest anyway."
          },
          this.survivor.body,
          this
        )
      )
      .then(() =>
        createSpeechBubble(
          {
            width: 300,
            height: 160,
            quote:
              "There is some sort of building down the road. Looks like a good shelter, I'll can push the buggy to there, doesn't look too far"
          },
          this.survivor.body,
          this
        )
      )
      .then(() => {
        this.tweens.add({
          targets: this.buggy,
          x: -200,
          ease: 'Power1',
          duration: 3000,
          yoyo: false,
          repeat: 0,
          onComplete: () => {
            this.scene.add(SCENES.BUILDING, BuildingScene, false)
            this.scene.start(SCENES.BUILDING)
          }
        })

        this.tweens.add({
          targets: this.survivor,
          x: -200,
          ease: 'Power1',
          duration: 3000,
          yoyo: false,
          repeat: 0
        })
      })
  }

  preload() {
    this.load.image(
      IMAGES.ROADSIGN.KEY,
      `assets/images/${IMAGES.ROADSIGN.FILE}`
    )
    this.load.image(IMAGES.ROAD.KEY, `assets/images/${IMAGES.ROAD.FILE}`)
    this.load.image(IMAGES.FLOOR.KEY, `assets/images/${IMAGES.FLOOR.FILE}`)
    this.load.image(
      IMAGES.ROADSIGN.KEY,
      `assets/images/${IMAGES.ROADSIGN.FILE}`
    )
    this.load.audio(AUDIO.WALK.KEY, `assets/sound/${AUDIO.WALK.FILE}`)
    this.load.spritesheet(
      IMAGES.BUGGY.KEY,
      `assets/images/${IMAGES.BUGGY.FILE}`,
      {
        frameWidth: 208,
        frameHeight: 108
      }
    )

    this.load.spritesheet(
      IMAGES.SURVIVOR.KEY,
      `assets/images/${IMAGES.SURVIVOR.FILE}`,
      {
        frameWidth: 40,
        frameHeight: 120
      }
    )
  }

  create() {
    const bg = this.add.image(0, 0, IMAGES.ROAD.KEY).setOrigin(0)
    bg.setDisplaySize(this.game.canvas.width, this.game.canvas.height)

    this.floor = this.physics.add
      .staticImage(0, 412, IMAGES.FLOOR.KEY)
      .setOrigin(0, 0)
      .refreshBody()

    this.roadsign = this.physics.add
      .staticImage(660, 340, IMAGES.ROADSIGN.KEY)
      .refreshBody()
      .setInteractive()

    this.roadsign.on('pointerup', () => {
      this.sys.events.on(this.look.sign.key, this.look.sign.cb, this)
    })

    this.initCutscene()
  }

  update() {
    if (!this.playingCutscene) {
      this.survivor.update()
    }
  }
}

export default RoadScene
