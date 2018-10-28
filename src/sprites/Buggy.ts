export default class Buggy extends Phaser.GameObjects.Sprite {
  body: Phaser.Physics.Arcade.Body

  constructor(config) {
    super(config.scene, config.x, config.y, config.key)
    config.scene.physics.world.enable(this)
    config.scene.add.existing(this)

    this.body.setSize(80, 100)
    this.body.setCollideWorldBounds(true)
    this.body.stopVelocityOnCollide = true
  }
}
