import { SPRITES } from '../constants'
import { BaseScene } from '../scenes/BaseScene'
const SPRITE = SPRITES.BUGGY

export class Buggy extends Phaser.GameObjects.Sprite {
  public body: Phaser.Physics.Arcade.Body

  constructor({ scene, x, y }: { scene: BaseScene; x: number; y: number }) {
    super(scene, x, y, SPRITE.KEY)
    scene.physics.world.enable(this)
    scene.add.existing(this)

    scene.anims.create({
      key: 'buggy-parked',
      frames: scene.anims.generateFrameNames(SPRITE.KEY, {
        start: 4,
        end: 4,
      }),
      repeat: -1,
    })

    scene.anims.create({
      key: 'buggy-stopped',
      frames: scene.anims.generateFrameNames(SPRITE.KEY, {
        start: 0,
        end: 0,
      }),
      repeat: -1,
    })

    scene.anims.create({
      key: 'buggy-driving',
      frames: scene.anims.generateFrameNames(SPRITE.KEY, {
        start: 0,
        end: 3,
      }),
      repeat: -1,
      frameRate: 8,
    })

    scene.anims.create({
      key: 'buggy-pushed',
      frames: scene.anims.generateFrameNames(SPRITE.KEY, {
        start: 4,
        end: 5,
      }),
      repeat: -1,
      frameRate: 6,
    })

    this.body.setSize(80, 100) // smaller than sprite size
    this.body.setCollideWorldBounds(true)
  }
}
