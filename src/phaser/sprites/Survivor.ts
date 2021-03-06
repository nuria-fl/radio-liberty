import { SPRITES, AUDIO } from '../constants'
import { BaseScene } from '../scenes/BaseScene'
const SPRITE = SPRITES.SURVIVOR

export class Survivor extends Phaser.Physics.Arcade.Sprite {
  public target = null
  public alive = true
  public isDown = false
  public acceleration = 600
  public body: Phaser.Physics.Arcade.Body
  public walkSound: Phaser.Sound.BaseSound
  public scene: BaseScene

  constructor({ scene, x, y }: { scene: BaseScene; x: number; y: number }) {
    super(scene, x, y, SPRITE.KEY)
    scene.physics.world.enable(this)
    scene.add.existing(this)

    this.scene = scene

    this.scene.anims.create({
      key: 'stand',
      frames: this.scene.anims.generateFrameNumbers(SPRITE.KEY, {
        start: 0,
        end: 0,
      }),
      repeat: -1,
    })

    this.scene.anims.create({
      key: 'walk',
      frames: this.scene.anims.generateFrameNumbers(SPRITE.KEY, {
        start: 1,
        end: 4,
      }),
      frameRate: 4,
      repeat: -1,
    })

    this.scene.anims.create({
      key: 'dead',
      frames: this.scene.anims.generateFrameNumbers(SPRITE.KEY, {
        start: 5,
        end: 5,
      }),
      repeat: -1,
    })

    this.scene.anims.create({
      key: 'push',
      frames: this.scene.anims.generateFrameNumbers(SPRITE.KEY, {
        start: 6,
        end: 11,
      }),
      frameRate: 4,
      repeat: -1,
    })

    this.scene.anims.create({
      key: 'fight',
      frames: this.scene.anims.generateFrameNumbers(SPRITE.KEY, {
        start: 12,
        end: 13,
      }),
      frameRate: 4,
      repeat: -1,
    })

    this.scene.anims.create({
      key: 'getUp',
      frames: this.scene.anims.generateFrameNumbers(SPRITE.KEY, {
        start: 14,
        end: 14,
      }),
      repeat: -1,
    })

    this.scene.anims.create({
      key: 'backwards',
      frames: this.scene.anims.generateFrameNumbers(SPRITE.KEY, {
        start: 15,
        end: 15,
      }),
      repeat: -1,
    })

    this.scene.anims.create({
      key: 'climbing',
      frames: this.scene.anims.generateFrameNumbers(SPRITE.KEY, {
        start: 16,
        end: 17,
      }),
      frameRate: 4,
      repeat: -1,
    })

    this.target = null
    this.body.setSize(40, SPRITE.HEIGHT)
    this.body.setCollideWorldBounds(true)
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
          volume: 0.1,
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
    return new Promise((resolve) => {
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
