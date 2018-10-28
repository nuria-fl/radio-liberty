import Survivor from '../characters/Survivor'

class GameScene extends Phaser.Scene {
  constructor() {
    super({
      key: 'GameScene'
    })
  }

  preload() {
    this.load.spritesheet('survivor', 'assets/images/survivor.png', {
      frameWidth: 80,
      frameHeight: 100
    })
  }

  create() {
    this.survivor = new Survivor({
      scene: this,
      key: 'survivor',
      x: 40,
      y: 0
    })

    this.input.on('pointerdown', pointer => {
      this.survivor.setDestination(pointer.downX)
      this.physics.moveTo(this.survivor, pointer.downX, this.survivor.y, 100)
    })
  }

  update() {
    this.survivor.update()
  }
}

export default GameScene
