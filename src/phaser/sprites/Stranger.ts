import { SPRITES } from '../constants'
import { BaseScene } from '../scenes/BaseScene'
const SPRITE = SPRITES.STRANGER

export class Stranger extends Phaser.GameObjects.Sprite {
  public body: Phaser.Physics.Arcade.Body

  constructor({ scene, x, y }: { scene: BaseScene; x: number; y: number }) {
    super(scene, x, y, SPRITE.KEY)
    scene.physics.world.enable(this)
    scene.add.existing(this)

    scene.anims.create({
      key: 'strangerStand',
      frames: scene.anims.generateFrameNames(SPRITE.KEY, {
        start: 0,
        end: 0,
      }),
      repeat: -1,
    })

    scene.anims.create({
      key: 'strangerWalk',
      frames: scene.anims.generateFrameNames(SPRITE.KEY, {
        start: 0,
        end: 4,
      }),
      frameRate: 4,
      repeat: -1,
    })

    scene.anims.create({
      key: 'strangerFight',
      frames: scene.anims.generateFrameNames(SPRITE.KEY, {
        start: 5,
        end: 6,
      }),
      frameRate: 4,
      repeat: -1,
    })

    scene.anims.create({
      key: 'strangerFlee',
      frames: scene.anims.generateFrameNames(SPRITE.KEY, {
        start: 7,
        end: 7,
      }),
      repeat: -1,
    })

    this.body.setSize(SPRITE.WIDTH, SPRITE.HEIGHT)
    this.body.setCollideWorldBounds(true)
  }
}
