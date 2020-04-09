import { IMAGES } from '../constants'

export default class Ladder extends Phaser.GameObjects.Sprite {
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
      key: 'ladderDay',
      frames: scene.anims.generateFrameNames(IMAGES.LADDER.KEY, {
        start: 0,
        end: 0
      }),
      repeat: -1
    })

    scene.anims.create({
      key: 'ladderNight',
      frames: scene.anims.generateFrameNames(IMAGES.LADDER.KEY, {
        start: 1,
        end: 1
      }),
      repeat: -1
    })

    this.body.setSize(56, 304)
  }
}
