import { AUDIO } from '../constants'
import { BaseScene } from '../scenes/BaseScene'

export default class Survivor extends Phaser.GameObjects.Sprite {
  public target = null
  public alive = true
  public acceleration = 600
  public body: Phaser.Physics.Arcade.Body
  public walkSound
  public scene: BaseScene

  constructor(config) {
    super(config.scene, config.x, config.y, config.key)
    config.scene.physics.world.enable(this)
    config.scene.add.existing(this)

    this.scene = config.scene
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

  public faceRight() {
    this.flipX = true
  }

  public faceLeft() {
    this.flipX = false
  }

  public moveTo(x: number, face: 'right' | 'left') {
    return new Promise(resolve => {
      this.setDestination(x)
      this.scene.physics.moveTo(
        this.scene.survivor,
        x,
        this.scene.survivor.y,
        100
      )

      const waitForStop = setInterval(() => {
        if (this.body.velocity.x === 0) {
          clearInterval(waitForStop)
          if (face === 'right') {
            this.faceRight()
          } else if (face === 'left') {
            console.log(face, 'face left')

            this.faceLeft()
          }
          resolve()
        }
      }, 100)
    })
  }

  public die() {
    this.body.setAcceleration(0, 0)
    this.body.setVelocity(0, -300)
    this.alive = false
  }
}
