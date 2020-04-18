import { SPRITES } from '../constants'
import { BaseScene } from '../scenes/BaseScene'
const SPRITE = SPRITES.BOXES

export class Boxes extends Phaser.GameObjects.Sprite {
  public body: Phaser.Physics.Arcade.Body

  constructor({ scene, x, y }: { scene: BaseScene; x: number; y: number }) {
    super(scene, x, y, SPRITE.KEY)
    scene.add.existing(this)

    scene.anims.create({
      key: 'boxesDay',
      frames: scene.anims.generateFrameNames(SPRITE.KEY, {
        start: 0,
        end: 0
      }),
      repeat: -1
    })

    scene.anims.create({
      key: 'boxesNight',
      frames: scene.anims.generateFrameNames(SPRITE.KEY, {
        start: 1,
        end: 1
      }),
      repeat: -1
    })
  }
}
