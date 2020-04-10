import { SPRITES } from '../constants'
import { BaseScene } from '../scenes/BaseScene'

export class Stranger extends Phaser.GameObjects.Sprite {
  public body: Phaser.Physics.Arcade.Body

  constructor({ scene, x, y }: { scene: BaseScene; x: number; y: number }) {
    super(scene, x, y, SPRITES.STRANGER.KEY)
    scene.physics.world.enable(this)
    scene.add.existing(this)

    scene.anims.create({
      key: 'standing',
      frames: scene.anims.generateFrameNames(SPRITES.STRANGER.KEY, {
        start: 0,
        end: 0
      }),
      repeat: -1
    })

    this.body.setSize(32, 100)
    this.body.setCollideWorldBounds(true)
    // this.body.stopVelocityOnCollide = true
  }
}
