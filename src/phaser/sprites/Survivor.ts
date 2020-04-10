import { SPRITES, AUDIO } from '../constants'
import { BaseScene } from '../scenes/BaseScene'

export class Survivor extends Phaser.GameObjects.Sprite {
  public target = null
  public alive = true
  public isDown = false
  public acceleration = 600
  public body: Phaser.Physics.Arcade.Body
  public walkSound
  public scene: BaseScene

  constructor({ scene, x, y }: { scene: BaseScene; x: number; y: number }) {
    super(scene, x, y, SPRITES.SURVIVOR.KEY)
    scene.physics.world.enable(this)
    scene.add.existing(this)

    this.scene = scene

    this.scene.anims.create({
      key: 'walk',
      frames: this.scene.anims.generateFrameNumbers(SPRITES.SURVIVOR.KEY, {
        start: 0,
        end: 3
      }),
      frameRate: 7,
      repeat: -1
    })

    this.scene.anims.create({
      key: 'stand',
      frames: this.scene.anims.generateFrameNumbers(SPRITES.SURVIVOR.KEY, {
        start: 0,
        end: 0
      }),
      repeat: -1
    })

    this.scene.anims.create({
      key: 'dead',
      frames: this.scene.anims.generateFrameNumbers(SPRITES.SURVIVOR.KEY, {
        start: 4,
        end: 4
      }),
      repeat: -1
    })

    this.scene.anims.create({
      key: 'push',
      frames: this.scene.anims.generateFrameNumbers(SPRITES.SURVIVOR.KEY, {
        start: 5,
        end: 6
      }),
      frameRate: 4,
      repeat: -1
    })

    this.scene.anims.create({
      key: 'fight',
      frames: this.scene.anims.generateFrameNumbers(SPRITES.SURVIVOR.KEY, {
        start: 7,
        end: 8
      }),
      frameRate: 4,
      repeat: -1
    })

    this.scene.anims.create({
      key: 'getUp',
      frames: this.scene.anims.generateFrameNumbers(SPRITES.SURVIVOR.KEY, {
        start: 9,
        end: 9
      }),
      repeat: -1
    })

    this.scene.anims.create({
      key: 'backwards',
      frames: this.scene.anims.generateFrameNumbers(SPRITES.SURVIVOR.KEY, {
        start: 10,
        end: 10
      }),
      repeat: -1
    })

    this.scene.anims.create({
      key: 'climbing',
      frames: this.scene.anims.generateFrameNumbers(SPRITES.SURVIVOR.KEY, {
        start: 11,
        end: 12
      }),
      frameRate: 4,
      repeat: -1
    })

    this.target = null
    this.body.setSize(40, 120)
    this.body.setCollideWorldBounds(true)
    // this.body.stopVelocityOnCollide = true
    this.walkSound = this.scene.sound.add(AUDIO.WALK.KEY)
  }

  public immobilize() {
    this.isDown = true
  }

  public recover() {
    this.isDown = false
    this.anims.play('stand')
  }

  public setDestination(target) {
    if (!this.isDown) {
      this.target = target - 20
    }
  }

  public stop() {
    this.body.velocity.x = 0
    this.target = null
    this.walkSound.stop()
    const stoppableAnimations = ['walk', 'climbing']
    if (
      !this.anims.currentAnim ||
      stoppableAnimations.includes(this.anims.currentAnim.key)
    ) {
      this.anims.play('stand')
    }
  }

  public update() {
    if (this.target && !this.isDown) {
      const movingLeft = this.body.velocity.x < 0
      const movingRight = this.body.velocity.x > 0
      if (!this.anims.currentAnim || this.anims.currentAnim.key !== 'walk') {
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
            this.faceLeft()
          }
          resolve()
        }
      }, 100)
    })
  }

  public die() {
    this.stop()
    this.anims.play('dead')
    this.alive = false
  }
}
