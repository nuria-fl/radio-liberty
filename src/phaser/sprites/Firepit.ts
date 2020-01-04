import { IMAGES } from '../constants'

export default class Firepit extends Phaser.GameObjects.Sprite {
  public body: Phaser.Physics.Arcade.Body

  constructor({
    scene,
    x,
    y,
    key
  }: {
    scene: Phaser.Scene
    x: number
    y: number
    key: string
  }) {
    super(scene, x, y, key)
    scene.physics.world.enable(this)
    scene.add.existing(this)

    scene.anims.create({
      key: 'default',
      frames: scene.anims.generateFrameNames(IMAGES.FIREPIT.KEY, {
        start: 0,
        end: 0
      }),
      repeat: -1
    })

    scene.anims.create({
      key: 'wood',
      frames: scene.anims.generateFrameNames(IMAGES.FIREPIT.KEY, {
        start: 1,
        end: 1
      }),
      repeat: -1
    })

    scene.anims.create({
      key: 'burning',
      frames: scene.anims.generateFrameNames(IMAGES.FIREPIT.KEY, {
        start: 2,
        end: 3
      }),
      frameRate: 4,
      repeat: -1
    })

    this.body.setSize(84, 60)
  }
}
