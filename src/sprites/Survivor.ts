export default class Survivor extends Phaser.GameObjects.Sprite {
  target = null
  alive = true
  acceleration = 600
  body: Phaser.Physics.Arcade.Body

  constructor(config) {
    super(config.scene, config.x, config.y, config.key)
    config.scene.physics.world.enable(this)
    config.scene.add.existing(this)

    this.target = null
    this.body.setSize(40, 120)
    this.body.setCollideWorldBounds(true)
    this.body.stopVelocityOnCollide = true
  }

  setDestination(target) {
    this.target = target - 20
  }

  stop() {
    this.body.velocity.x = 0
    this.target = null
    this.anims.stop()
    this.anims.setCurrentFrame(this.anims.currentAnim.frames[0])
  }

  update() {
    if (this.target) {
      const movingLeft = this.body.velocity.x < 0
      const movingRight = this.body.velocity.x > 0
      if (!this.anims.isPlaying) {
        this.anims.play('walk')
      }
      if (movingRight) {
        this.flipX = true
      } else {
        this.flipX = false
      }
      if (
        (movingRight && this.body.x >= this.target) ||
        (movingLeft && this.body.x <= this.target)
      ) {
        this.stop()
      }
    }
  }

  die() {
    this.body.setAcceleration(0, 0)
    this.body.setVelocity(0, -300)
    this.alive = false
  }
}
