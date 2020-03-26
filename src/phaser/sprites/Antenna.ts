import { IMAGES } from '../constants'

export default class Antenna extends Phaser.GameObjects.Sprite {
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
      key: 'antennaBlink',
      frames: scene.anims.generateFrameNames(IMAGES.ANTENNA.KEY, {
        start: 0,
        end: 1
      }),
      frameRate: 1,
      repeat: -1
    })
  }
}
