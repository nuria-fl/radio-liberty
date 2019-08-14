import { SCENES } from '../constants'
import RoadScene from './RoadScene'
import BuildingScene from './BuildingScene'

class GameScene extends Phaser.Scene {
  constructor() {
    super({
      key: SCENES.GAME
    })
  }

  public preload() {}

  public create() {
    // this.scene.add(SCENES.ROAD, RoadScene, false)
    // this.scene.launch(SCENES.ROAD)
    this.scene.add(SCENES.BUILDING, BuildingScene, false)
    this.scene.launch(SCENES.BUILDING)
  }
}

export default GameScene
