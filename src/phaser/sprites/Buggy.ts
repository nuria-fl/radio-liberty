import { SPRITES } from '../constants'
import { BaseScene } from '../scenes/BaseScene'

export class Buggy extends Phaser.GameObjects.Sprite {
  public body: Phaser.Physics.Arcade.Body

  constructor({ scene, x, y }: { scene: BaseScene; x: number; y: number }) {
    super(scene, x, y, SPRITES.BUGGY.KEY)
    scene.physics.world.enable(this)
    scene.add.existing(this)

    scene.anims.create({
      key: 'buggy-parked',
      frames: scene.anims.generateFrameNames(SPRITES.BUGGY.KEY, {
        start: 1,
        end: 1
      }),
      repeat: -1
    })

    scene.anims.create({
      key: 'buggy-driving',
      frames: scene.anims.generateFrameNames(SPRITES.BUGGY.KEY, {
        start: 0,
        end: 0
      }),
      repeat: -1
    })

    this.body.setSize(80, 100)
    this.body.setCollideWorldBounds(true)
    // this.body.stopVelocityOnCollide = true
  }
}
