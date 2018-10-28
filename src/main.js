import 'phaser';
import GameScene from './scenes/GameScene';

const config = {
  // For more settings see <https://github.com/photonstorm/phaser/blob/master/src/boot/Config.js>
  type: Phaser.WEBGL,
  pixelArt: true,
  roundPixels: true,
  parent: 'content',
  width: 600,
  height: 400,
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 800 },
      debug: false
    }
  },
  scene: [
    GameScene
  ]
};

const game = new Phaser.Game(config);