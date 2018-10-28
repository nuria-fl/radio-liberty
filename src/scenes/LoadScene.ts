import { SCENES } from '../constants'
import GameScene from './GameScene'

class LoadScene extends Phaser.Scene {
  constructor() {
    super({
      key: SCENES.LOAD
    })
  }

  preload() {
    let loadingBar = this.add.graphics({
      fillStyle: {
        color: 0xffffff
      }
    })

    this.load.on('progress', percentage => {
      loadingBar.fillRect(
        this.game.renderer.width / 2,
        0,
        50,
        this.game.renderer.height * percentage
      )
    })
  }

  create() {
    this.scene.add(SCENES.GAME, GameScene, false)
    this.scene.start(SCENES.GAME)
  }
}

export default LoadScene
