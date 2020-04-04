import { IMAGES } from '../constants'

export default class Boxes extends Phaser.GameObjects.Sprite {
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
    scene.add.existing(this)

    scene.anims.create({
      key: 'boxesDay',
      frames: scene.anims.generateFrameNames(IMAGES.BOXES.KEY, {
        start: 0,
        end: 0
      }),
      repeat: -1
    })

    scene.anims.create({
      key: 'boxesNight',
      frames: scene.anims.generateFrameNames(IMAGES.BOXES.KEY, {
        start: 1,
        end: 1
      }),
      repeat: -1
    })
  }
}
