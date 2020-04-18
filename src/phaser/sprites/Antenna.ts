import { SPRITES } from '../constants'
import { BaseScene } from '../scenes/BaseScene'

export class Antenna extends Phaser.GameObjects.Sprite {
  public body: Phaser.Physics.Arcade.Body

  constructor({ scene, x, y }: { scene: BaseScene; x: number; y: number }) {
    super(scene, x, y, SPRITES.ANTENNA.KEY)
    scene.add.existing(this)

    scene.anims.create({
      key: 'antennaBlink',
      frames: scene.anims.generateFrameNames(SPRITES.ANTENNA.KEY, {
        start: 0,
        end: 1
      }),
      frameRate: 1,
      repeat: -1
    })
    scene.anims.create({
      key: 'antennaNightBlink',
      frames: scene.anims.generateFrameNames(SPRITES.ANTENNA.KEY, {
        start: 2,
        end: 3
      }),
      frameRate: 1,
      repeat: -1
    })
  }
}
