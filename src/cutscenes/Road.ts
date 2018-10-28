import { CUTSCENES, SCENES, IMAGES } from '../constants'
import RoadScene from '../scenes/RoadScene'
import Buggy from '../sprites/Buggy'

class GameScene extends Phaser.Scene {
  buggy: Buggy

  constructor() {
    super({
      key: CUTSCENES.ROAD
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
  }

  create() {
    this.buggy = new Buggy({
      scene: this,
      key: IMAGES.BUGGY.KEY,
      x: 1000,
      y: 600
    })

    this.tweens.add({
      targets: this.buggy,
      x: 200,
      ease: 'Power1',
      duration: 3000,
      yoyo: false,
      repeat: 0,
      onComplete: () => {
        this.scene.add(SCENES.ROAD, RoadScene, false)
        this.scene.start(SCENES.ROAD)
      }
    })
  }
}

export default GameScene
