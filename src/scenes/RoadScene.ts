import { SCENES, IMAGES } from '../constants'
import Survivor from '../sprites/Survivor'
import Buggy from '../sprites/Buggy'

class RoadScene extends Phaser.Scene {
  survivor: Survivor
  buggy: Buggy
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
      y: 600
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
      y: 600
    })

    this.input.on('pointerdown', pointer => {
      if (this.playingCutscene === false) {
        this.survivor.setDestination(pointer.downX)
        this.physics.moveTo(this.survivor, pointer.downX, this.survivor.y, 100)
      }
    })
  }

  preload() {
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
        frameWidth: 80,
        frameHeight: 100
      }
    )
  }

  create() {
    this.initCutscene()
  }

  update() {
    if (!this.playingCutscene) {
      this.survivor.update()
    }
  }
}

export default RoadScene
