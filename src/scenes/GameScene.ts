import { CUTSCENES, SCENES, IMAGES } from '../constants'
import RoadCutScene from '../cutscenes/Road'

class GameScene extends Phaser.Scene {
  constructor() {
    super({
      key: SCENES.GAME
    })
  }

  preload() {}

  create() {
    this.scene.add(CUTSCENES.ROAD, RoadCutScene, false)
    this.scene.launch(CUTSCENES.ROAD)
  }
}

export default GameScene
