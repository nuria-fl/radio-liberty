import { SPRITES } from '../constants'
import { BaseScene } from '../scenes/BaseScene'

export class Bucket extends Phaser.GameObjects.Sprite {
  public body: Phaser.Physics.Arcade.Body

  constructor({ scene, x, y }: { scene: BaseScene; x: number; y: number }) {
    super(scene, x, y, SPRITES.BUCKET.KEY)
    scene.physics.world.enable(this)
    scene.add.existing(this)

    scene.anims.create({
      key: 'bucketDay',
      frames: scene.anims.generateFrameNames(SPRITES.BUCKET.KEY, {
        start: 0,
        end: 0
      }),
      repeat: -1
    })

    scene.anims.create({
      key: 'bucketNight',
      frames: scene.anims.generateFrameNames(SPRITES.BUCKET.KEY, {
        start: 1,
        end: 1
      }),
      repeat: -1
    })

    this.body.setSize(28, 48)
  }
}