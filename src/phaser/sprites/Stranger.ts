import { IMAGES } from '../constants'

export default class Stranger extends Phaser.GameObjects.Sprite {
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
      key: 'standing',
      frames: scene.anims.generateFrameNames(IMAGES.STRANGER.KEY, {
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
