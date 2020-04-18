import { SPRITES } from '../constants'
import { BaseScene } from '../scenes/BaseScene'

export class MetalBox extends Phaser.GameObjects.Sprite {
  public body: Phaser.Physics.Arcade.Body

  constructor({ scene, x, y }: { scene: BaseScene; x: number; y: number }) {
    super(scene, x, y, SPRITES.METALBOX.KEY)
    scene.add.existing(this)

    scene.anims.create({
      key: 'metalBoxDay',
      frames: scene.anims.generateFrameNames(SPRITES.METALBOX.KEY, {
        start: 0,
        end: 0
      }),
      repeat: -1
    })

    scene.anims.create({
      key: 'metalBoxNight',
      frames: scene.anims.generateFrameNames(SPRITES.METALBOX.KEY, {
        start: 1,
        end: 1
      }),
      repeat: -1
    })
  }
}
