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
    if (process.env.NODE_ENV === 'development') {
      // on dev mode allow to load all scenes
      this.scene.add(SCENES.ROAD, RoadScene, false)
      this.scene.add(SCENES.BUILDING, BuildingScene, false)
      if (window.location.search) {
        const scene = window.location.search.split('?scene=')
        return scene[1].toUpperCase()
      }
      return SCENES.ROAD
    } else {
      this.scene.add(SCENES.ROAD, RoadScene, false)
      return SCENES.ROAD
    }
  }
}

export default GameScene
