import { SCENES } from '../constants'
import RoadScene from './RoadScene'
import BuildingScene from './BuildingScene'

class GameScene extends Phaser.Scene {
  constructor() {
    super({
      key: SCENES.GAME
    })
  }

  public create() {
    const scene = this.chooseScene()
    this.add
      .text(342, 284, 'Start Game', {
        fontSize: 24,
        color: '#fff'
      })
      .setInteractive({ useHandCursor: true })
      .on('pointerdown', () => {
        this.scene.start(scene)
      })
  }

  private chooseScene() {
    if (process.env.NODE_ENV === 'development' && window.location.search) {
      const scenes = {
        ROAD: RoadScene,
        BUILDING: BuildingScene
      }
      const scene = window.location.search.split('?scene=')[1].toUpperCase()
      this.scene.add(scene, scenes[scene], false)
      return scene
    } else {
      this.scene.add(SCENES.ROAD, RoadScene, false)
      return SCENES.ROAD
    }
  }
}

export default GameScene
