import { SCENES } from '../constants'
import RoadScene from './RoadScene'

class GameScene extends Phaser.Scene {
  constructor() {
    super({
      key: SCENES.GAME
    })
  }

  public preload() {}

  public create() {
    this.scene.add(SCENES.ROAD, RoadScene, false)
    this.scene.launch(SCENES.ROAD)
  }
}

export default GameScene
