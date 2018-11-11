import { SCENES, IMAGES } from '../constants'
import Survivor from '../sprites/Survivor'
import Buggy from '../sprites/Buggy'
import { Physics } from 'phaser'

class RoadScene extends Phaser.Scene {
  survivor: Survivor
  buggy: Buggy
  floor: Physics.Arcade.Image
  roadsign: Physics.Arcade.Image
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
        this.buggy.play('buggy-parked')
        this.initSurvivor()
        this.playingCutscene = false
      }
    })
  }

  initSurvivor() {
    this.survivor = new Survivor({
      scene: this,
      key: IMAGES.SURVIVOR.KEY,
      x: 100,
      y: 366
    })
    this.physics.add.collider(this.floor, this.survivor)
    this.physics.add.overlap(this.survivor, this.roadsign, () => {
      this.sys.events.emit(this.look.sign.key)
    })

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

  lookAtSign() {
    console.log('It reads something like… P A … S')
    this.sys.events.off(this.look.sign.key, this.look.sign.cb, this, false)
  }

  lookAtBuggy() {
    console.log('Hmm…')
    this.sys.events.off(this.look.buggy.key, this.look.buggy.cb, this, false)
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
    this.load.spritesheet(
      IMAGES.BUGGY.KEY,
      `assets/images/${IMAGES.BUGGY.FILE}`,
      {
        frameWidth: 194,
        frameHeight: 104
      }
    )

    this.load.spritesheet(
      IMAGES.SURVIVOR.KEY,
      `assets/images/${IMAGES.SURVIVOR.FILE}`,
      {
        frameWidth: 37,
        frameHeight: 88
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
