import { SCENES, IMAGES } from '../constants'
import Survivor from '../sprites/Survivor'

class GameScene extends Phaser.Scene {
  constructor() {
    super({
      key: SCENES.GAME
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
    this.survivor = new Survivor({
      scene: this,
      key: IMAGES.SURVIVOR.KEY,
      x: 40,
      y: 0
    })

    this.input.on('pointerdown', pointer => {
      this.survivor.setDestination(pointer.downX)
      this.physics.moveTo(this.survivor, pointer.downX, this.survivor.y, 100)
    })
  }

  update() {
    this.survivor.update()
  }
}

export default GameScene
