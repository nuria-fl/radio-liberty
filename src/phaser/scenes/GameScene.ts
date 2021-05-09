import { SCENES } from '../constants'
import RoadScene from './chapter1/RoadScene'
import BuildingScene from './chapter1/BuildingScene'
import C2BuildingScene from './chapter2/BuildingScene'
import { cameraFade, cameraPan } from '../utils/promisify'

class GameScene extends Phaser.Scene {
  constructor() {
    super({
      key: SCENES.GAME,
    })
  }

  public preload() {
    this.load.image('COVER', `./images/common/cover.png`)
    this.load.image('LOGO', `./images/common/logo.png`)
    this.load.image('NEW_GAME_BUTTON', `./images/common/new-game.png`)
    this.load.image('CONTINUE_BUTTON', `./images/common/continue.png`)
  }

  public create() {
    this.add.image(0, 0, 'COVER').setOrigin(0)
    this.add.image(415, 150, 'LOGO')

    if (
      localStorage.getItem('SCENE') ||
      (process.env.NODE_ENV === 'development' && window.location.search)
    ) {
      this.add
        .image(415, 350, 'CONTINUE_BUTTON')
        .setInteractive({ useHandCursor: true })
        .on('pointerdown', async () => {
          cameraPan(this, 415, 0, 1500)
          const scene = this.chooseScene(
            localStorage.getItem('SCENE') ||
              window.location.search.split('?scene=')[1]
          )
          await cameraFade(this, 'fadeOut', 1000, {
            red: 207,
            green: 233,
            blue: 249,
          })

          this.scene.start(scene)
        })
    }
    this.add
      .image(415, 230, 'NEW_GAME_BUTTON')
      .setInteractive({ useHandCursor: true })
      .on('pointerdown', async () => {
        cameraPan(this, 415, 0, 1500)
        localStorage.removeItem('SCENE')
        this.scene.add(SCENES.ROAD, RoadScene, false)

        await cameraFade(this, 'fadeOut', 1000, {
          red: 207,
          green: 233,
          blue: 249,
        })

        this.scene.start(SCENES.ROAD)
      })

    this.add
      .image(415, 290, 'NEW_GAME_BUTTON')
      .setInteractive({ useHandCursor: true })
      .on('pointerdown', async () => {
        cameraPan(this, 415, 0, 1500)
        localStorage.removeItem('SCENE')
        this.scene.add(SCENES.C2BUILDING, C2BuildingScene, false)

        await cameraFade(this, 'fadeOut', 1000, {
          red: 207,
          green: 233,
          blue: 249,
        })

        this.scene.start(SCENES.C2BUILDING)
      })
  }

  private chooseScene(scene) {
    const scenes = {
      ROAD: RoadScene,
      BUILDING: BuildingScene,
    }
    this.scene.add(scene, scenes[scene], false)
    return scene
  }
}

export default GameScene
