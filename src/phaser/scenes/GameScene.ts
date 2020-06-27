import { SCENES } from '../constants'
import RoadScene from './RoadScene'
import BuildingScene from './BuildingScene'
import { cameraFade } from '../utils/promisify'

class GameScene extends Phaser.Scene {
  constructor() {
    super({
      key: SCENES.GAME,
    })
  }

  public preload() {
    this.load.image('COVER', `/images/common/cover.png`)
    this.load.image('LOGO', `/images/common/logo.png`)
    this.load.image('BUTTON', `/images/common/button.png`)
  }

  public create() {
    const scene = this.chooseScene()
    this.add.image(0, 0, 'COVER').setOrigin(0)
    this.add.image(415, 150, 'LOGO')
    this.add
      .image(415, 230, 'BUTTON')
      .setInteractive({ useHandCursor: true })
      .on('pointerdown', async () => {
        await cameraFade(this, 'fadeOut')
        this.scene.start(scene)
      })
  }

  private chooseScene() {
    if (process.env.NODE_ENV === 'development' && window.location.search) {
      const scenes = {
        ROAD: RoadScene,
        BUILDING: BuildingScene,
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
