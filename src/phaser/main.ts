import 'phaser'
import LoadScene from './scenes/LoadScene'

const config = {
  type: Phaser.WEBGL,
  pixelArt: true,
  roundPixels: true,
  parent: 'content',
  width: 830,
  height: 520,
  transparent: true,
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 800 },
      debug: process.env.NODE_ENV === 'development',
    },
  },
  scene: [LoadScene],
}

new Phaser.Game(config)
