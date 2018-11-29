import 'phaser'
import LoadScene from './scenes/LoadScene'

const config = {
  type: Phaser.WEBGL,
  pixelArt: true,
  roundPixels: true,
  parent: 'content',
  width: 830,
  height: 520,
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 800 },
      debug: false
    }
  },
  scene: [LoadScene]
}

const game = new Phaser.Game(config)
