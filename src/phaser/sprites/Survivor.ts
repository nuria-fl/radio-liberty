import { AUDIO } from '../constants'

export default class Survivor extends Phaser.GameObjects.Sprite {
  public target = null
  public alive = true
  public acceleration = 600
  public body: Phaser.Physics.Arcade.Body
  public walkSound

  constructor(config) {
    super(config.scene, config.x, config.y, config.key)
    config.scene.physics.world.enable(this)
    config.scene.add.existing(this)

    this.target = null
    this.body.setSize(40, 120)
    this.body.setCollideWorldBounds(true)
    // this.body.stopVelocityOnCollide = true
    this.walkSound = this.scene.sound.add(AUDIO.WALK.KEY)
  }

  public setDestination(target) {
    this.target = target - 20
  }

  public stop() {
    this.body.velocity.x = 0
    this.target = null
    this.anims.stop()
    this.walkSound.stop()
    this.anims.setCurrentFrame(this.anims.currentAnim.frames[0])
  }

  public update() {
    if (this.target) {
      const movingLeft = this.body.velocity.x < 0
      const movingRight = this.body.velocity.x > 0
      if (!this.anims.isPlaying) {
        this.anims.play('walk')
        this.walkSound.play('', {
          loop: true,
          volume: 0.1
        })
      }
      if (movingRight) {
        this.flipX = true
      } else {
        this.flipX = false
      }
      if (
        (movingRight && this.body.x >= this.target) ||
        (movingLeft && this.body.x <= this.target) ||
        (!movingLeft && !movingRight)
      ) {
        this.stop()
      }
    }
  }

  public die() {
    this.body.setAcceleration(0, 0)
    this.body.setVelocity(0, -300)
    this.alive = false
  }
}
