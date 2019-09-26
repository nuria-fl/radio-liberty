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
    this.scene.add(SCENES.ROAD, RoadScene, false)
    this.add
      .text(342, 284, 'Start Game', {
        fontSize: 24,
        color: '#fff'
      })
      .setInteractive({ useHandCursor: true })
      .on('pointerdown', () => {
        this.scene.start(SCENES.ROAD)
      })
  }
}

export default GameScene
