import { SCENES, IMAGES } from '../constants'
import Survivor from '../sprites/Survivor'
import Buggy from '../sprites/Buggy'
import { Physics } from 'phaser'

class RoadScene extends Phaser.Scene {
  survivor: Survivor
  buggy: Buggy
  floor: Physics.Arcade.Image
  platforms
  playingCutscene = true

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
      y: 300
    })
    this.physics.add.collider(this.floor, this.buggy)

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
      y: 200
    })
    this.physics.add.collider(this.floor, this.survivor)

    this.input.on('pointerdown', pointer => {
      if (this.playingCutscene === false) {
        this.survivor.setDestination(pointer.downX)
        this.physics.moveTo(this.survivor, pointer.downX, this.survivor.y, 100)
      }
    })
  }

  preload() {
    this.load.image(
      IMAGES.ROADSIGN.KEY,
      `assets/images/${IMAGES.ROADSIGN.FILE}`
    )
    this.load.image(IMAGES.ROAD.KEY, `assets/images/${IMAGES.ROAD.FILE}`)
    this.load.image(IMAGES.FLOOR.KEY, `assets/images/${IMAGES.FLOOR.FILE}`)
    this.load.spritesheet(
      IMAGES.BUGGY.KEY,
      `assets/images/${IMAGES.BUGGY.FILE}`,
      {
        frameWidth: 389,
        frameHeight: 208
      }
    )

    this.load.spritesheet(
      IMAGES.SURVIVOR.KEY,
      `assets/images/${IMAGES.SURVIVOR.FILE}`,
      {
        frameWidth: 58,
        frameHeight: 137
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

    this.initCutscene()
  }

  update() {
    if (!this.playingCutscene) {
      this.survivor.update()
    }
  }
}

export default RoadScene
