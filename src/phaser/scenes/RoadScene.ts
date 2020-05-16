import PathFollower from 'phaser3-rex-plugins/plugins/pathfollower.js'
import { Physics } from 'phaser'
import { BaseScene } from './BaseScene'
import { randomLine } from '../default-lines'
import { SCENES, IMAGES, AUDIO, SPRITES } from '../constants'
import { Survivor } from '../sprites/Survivor'
import { Buggy } from '../sprites/Buggy'
import BuildingScene from './BuildingScene'
import { cameraFade, timer } from '../utils/promisify'

class RoadScene extends BaseScene {
  public interact = {
    roadsign: {
      key: 'lookSign',
      text: 'Look at road sign',
      cb: this.interactSign,
    },
    buggy: {
      key: 'lookBuggy',
      text: 'Look at buggy',
      cb: this.interactBuggy,
    },
    pinecone: {
      key: 'lookPinecone',
      text: 'Pick up pinecone',
      cb: this.interactPinecone,
    },
  }
  public use = {
    ...this.use,
    roadsign: {
      setText: null,
      name: 'Road sign',
      use: () => {
        this.interactingWithObject = true
        return this.createDialog(randomLine())
      },
    },
    buggy: {
      setText: null,
      name: 'Buggy',
      use: () => {
        this.interactingWithObject = true
        return this.createDialog(randomLine())
      },
    },
    pinecone: {
      setText: null,
      name: 'Pine cone',
      use: () => {
        this.interactingWithObject = true
        return this.createDialog(randomLine())
      },
    },
  }

  public WORLD = {
    WIDTH: 2520,
    HEIGHT: 720,
  }
  private buggy: Buggy
  private platforms: Physics.Arcade.StaticGroup
  private sky: Phaser.GameObjects.TileSprite
  private mountains: Phaser.GameObjects.TileSprite
  private forest: Phaser.GameObjects.TileSprite
  private trees: Phaser.GameObjects.TileSprite
  private hills: Phaser.GameObjects.TileSprite
  private road: Phaser.GameObjects.TileSprite
  private guardrail: Phaser.GameObjects.TileSprite
  private grass: Phaser.GameObjects.TileSprite
  private grassForeground: Phaser.GameObjects.TileSprite
  private roadsign: Physics.Arcade.Image
  private pinecone: Physics.Arcade.Image
  private engine: any
  private introAudio: Phaser.Sound.BaseSound
  private roadCreated = false

  constructor() {
    super({
      key: SCENES.ROAD,
    })
  }

  public preload() {
    // Load common assets
    this.commonPreload()

    // Preload audio
    this.loadAudio(AUDIO.INTRO)

    // Preload images
    this.loadImage(IMAGES.FLOOR)
    this.loadImage(IMAGES.BROKEN_GUARDRAIL)
    this.loadImage(IMAGES.FOREST)
    this.loadImage(IMAGES.GRASS)
    this.loadImage(IMAGES.GUARDRAIL)
    this.loadImage(IMAGES.INTRO_VIEW)
    this.loadImage(IMAGES.MOUNTAINS)
    this.loadImage(IMAGES.PINECONE)
    this.loadImage(IMAGES.RADIO)
    this.loadImage(IMAGES.ROADSIGN)
    this.loadImage(IMAGES.ROAD)
    this.loadImage(IMAGES.SKY)
    this.loadImage(IMAGES.TINY_BUGGY)
    this.loadImage(IMAGES.TREES_HILLS)

    // Preload sprites
    this.loadSprite(SPRITES.BUGGY)
    this.loadSprite(SPRITES.NOISE)
    this.loadSprite(SPRITES.ROAD_WINDOW)
  }

  public create() {
    this.introAudio = this.sound.add(AUDIO.INTRO.KEY)

    this.introAudio.play()
    this.initScene()
    this.cameras.main.setBounds(0, 0, this.WORLD.WIDTH, this.WORLD.HEIGHT)
    this.cameras.main.setBackgroundColor('#9fb9b4')
    this.cameras.main.fadeIn(3000)
    this.runViewCutscene()
  }

  public update() {
    if (this.roadCreated) {
      this.sky.tilePositionX = this.cameras.main.scrollX * 0.1
      this.mountains.tilePositionX = this.cameras.main.scrollX * 0.2
      this.forest.tilePositionX = this.cameras.main.scrollX * 0.3
      this.trees.tilePositionX = this.cameras.main.scrollX * 0.4
      this.hills.tilePositionX = this.cameras.main.scrollX * 0.5
      this.road.tilePositionX = this.cameras.main.scrollX
      this.grass.tilePositionX = this.cameras.main.scrollX * 1.1
      this.grassForeground.tilePositionX = this.cameras.main.scrollX * 1.2
    }

    if (!this.playingCutscene) {
      this.survivor.update()
    }
  }

  private async runViewCutscene() {
    const view = this.add
      .image(0, 0, IMAGES.INTRO_VIEW.KEY)
      .setOrigin(0, 0)
      .setDepth(1)
      .setScrollFactor(0)
    const tinyBuggy: any = this.add
      .image(-20, 480, IMAGES.TINY_BUGGY.KEY)
      .setDepth(1)
      .setScrollFactor(0)

    const path = this.add
      .path(-20, 500)
      .lineTo(78, 412)
      .lineTo(210, 340)
      .lineTo(291, 347)
      .lineTo(487, 270)
      .lineTo(650, 150)
      .lineTo(773, 0)

    tinyBuggy.pathFollower = new PathFollower(tinyBuggy, {
      path: path,
      t: 0,
      rotateToPath: true,
    })

    await timer(this, 1000)
    this.createNarratorDialog(
      "It's been a few hundred years since the end of the world.\n\nClimate change caused floods, draughts, hurricanes.\n\nEconomy collapsed. All was lₒst.",
      false
    )
    const steps = []
    let image: Phaser.GameObjects.Sprite
    let noise: Phaser.GameObjects.Sprite
    let radio: Phaser.GameObjects.Image
    let needle: Phaser.GameObjects.Graphics
    let box: Phaser.GameObjects.Graphics
    let needleTween: Phaser.Tweens.Tween

    await timer(this, 6000)
    this.tweens.add({
      targets: tinyBuggy.pathFollower,
      t: 1,
      ease: 'Linear',
      duration: 25000,
      yoyo: false,
      repeat: 0,
      onUpdate: ({ progress }) => {
        if (progress > 0.15 && !steps[0]) {
          steps.push(true)
          this.createNarratorDialog(
            'People alw̴ays find a wa̶y to survive, t̶ho̴u̸gh.\n\nSome people geΓ by scavenging for supₚlies.\n\nOth■rs, stealiₚg and killiⁿg t̶hem.',
            false
          )
          box = this.add
            .graphics()
            .setDepth(1)
            .fillStyle(0x000000, 0.7)
            .fillRect(571, 342, 234, 156)
          image = this.createWindow()
        }

        if (progress > 0.26 && progress < 0.28) {
          this.cameras.main.flash(100)
        }

        if (progress > 0.35 && !steps[1]) {
          steps.push(true)
          radio = this.add
            .image(688, 420, IMAGES.RADIO.KEY)
            .setDepth(1)
            .setScrollFactor(0)
          needle = this.add
            .graphics()
            .setDepth(1)
            .fillStyle(0xac3232)
            .fillRect(648, 400, 5, 20)

          needleTween = this.tweens.add({
            targets: needle,
            x: 70,
            duration: 1000,
            ease: 'Circ',
            yoyo: true,
            loop: -1,
            hold: 200,
            loopDelay: 500,
          })
          noise = this.createNoise()
          this.cameras.main.flash(100)
        }

        if (progress > 0.4 && progress < 0.407) {
          this.cameras.main.flash(100)
          noise.setAlpha(0, 0, 0, 0)
          this.cameras.main.shake(150, 0.02)
        }

        if (progress > 0.5 && !steps[2]) {
          steps.push(true)
          this.createNarratorDialog(
            'Oₚr survivₒr ₚₚ ha̶s be⍰n ₚ✝︎ra̶v3#ₚliⁿქ ནhპ ⎍␡ cₚქₚt\n\n☓∑⌗  ̷of ✦ᵤrₒₚₑ, ₚl⍰■e ᶠᶦⁿ◀︎ᵈing a wₚ ⚈ₚay ◗ to  s̶t̶ay̶ a̶livₚ ͕̱',
            false
          )
          needleTween.pause()
          needle.setAlpha(0)
          radio.setAlpha(0, 0, 0, 0)
          this.cameras.main.shake(100, 0.02)
          this.cameras.main.flash(50)
        }

        if (progress > 0.52 && progress < 0.53) {
          this.cameras.main.flash(100)
          noise.setAlpha(0.5, 0.5, 0.5, 0.5)
          this.cameras.main.shake(150, 0.02)
        }

        if (progress > 0.59 && progress < 0.6) {
          noise.setAlpha(0, 0, 0, 0)
        }

        if (progress > 0.65 && !steps[3]) {
          steps.push(true)
          this.cameras.main.flash(100)
          this.cameras.main.shake(100, 0.02)
          needle.setAlpha(1)
          needleTween.setTimeScale(6).resume()
          radio.setAlpha(1, 1, 1, 1)
          noise.setAlpha(0.5, 0.5, 0.5, 0.5)
        }

        if (progress > 0.69 && progress < 0.7) {
          this.cameras.main.flash(50)
          noise.setAlpha(0, 0, 0, 0)
        }

        if (progress > 0.72 && progress < 0.73) {
          this.cameras.main.flash(100)
          this.cameras.main.shake(150, 0.02)
          this.cameras.main.flash(50)
          noise.setAlpha(0.5, 0.5, 0.5, 0.5)
        }

        if (progress > 0.75 && progress < 0.76) {
          noise.setAlpha(0, 0, 0, 0)
        }

        if (progress > 0.8 && !steps[4]) {
          steps.push(true)
          box.destroy()
          image.destroy()
          needleTween.stop()
          needle.destroy()
          radio.destroy()
          this.cameras.main.flash(50)
          this.cameras.main.shake(100, 0.02)
          noise.setAlpha(0.5, 0.5, 0.5, 0.5)
          this.tweens.add({
            targets: [view, tinyBuggy, noise],
            alphaTopLeft: 0,
            alphaTopRight: 0,
            alphaBottomRight: 0,
            alphaBottomLeft: 0,
            duration: 2000,
            yoyo: false,
            repeat: 0,
            onUpdate: ({ progress }) => {
              if (progress > 0.5 && this.dialog.text) {
                this.dialog.closeDialog()
              }
            },
          })
          this.runRoadCutscene()
        }
        if (progress === 1) {
          view.destroy()
          noise.destroy()
          // destroying the tinyBuggy causes some issue with the path follower plugin
          // tinyBuggy.destroy()
        }
      },
    })
  }

  private createNoise() {
    const noise = this.add
      .sprite(0, 0, SPRITES.NOISE.KEY)
      .setOrigin(0, 0)
      .setDepth(1)
      .setScale(1.2, 1.2)
      .setScrollFactor(0)
      .setBlendMode(Phaser.BlendModes.SCREEN)
      .setAlpha(0.5, 0.5, 0.5, 0.5)

    this.anims.create({
      key: 'noise',
      frames: this.anims.generateFrameNames(SPRITES.NOISE.KEY, {
        start: 0,
        end: 6,
      }),
      frameRate: 12,
      repeat: -1,
    })

    noise.play('noise')
    return noise
  }

  private createWindow() {
    const road = this.add
      .sprite(688, 420, SPRITES.ROAD_WINDOW.KEY)
      .setDepth(1)
      .setScrollFactor(0)

    this.anims.create({
      key: 'road-window',
      frames: this.anims.generateFrameNames(SPRITES.ROAD_WINDOW.KEY, {
        start: 0,
        end: 3,
      }),
      frameRate: 4,
      repeat: -1,
    })

    road.play('road-window')
    return road
  }

  private runRoadCutscene() {
    this.buildRoad()

    this.cameras.main.startFollow(this.buggy, false, 1, 1, 0, 120)
    this.buggy.play('buggy-driving')

    this.tweens.add({
      targets: this.buggy,
      x: 200,
      ease: 'Sine.easeOut',
      duration: 8000,
      yoyo: false,
      repeat: 0,
      onUpdate: ({ progress }) => {
        if (progress > 0.31 && progress < 0.32) {
          this.cameras.main.flash(100)
          this.cameras.main.shake(150, 0.02)
        }

        if (progress > 0.41 && progress < 0.42) {
          this.cameras.main.flash(100)
        }

        if (progress > 0.65 && progress < 0.66) {
          this.cameras.main.shake(100, 0.02)
          this.cameras.main.flash(100)
        }

        if (
          progress > 0.78 &&
          this.buggy.anims.currentAnim.key === 'buggy-driving'
        ) {
          this.buggy.play('buggy-stopped')
        }
      },
      onComplete: async () => {
        this.dialog.closeDialog()
        await this.createDialog('What the…?')
        this.startPlay()
      },
    })
  }

  private buildRoad() {
    const VIEWPORT_WIDTH = this.WORLD.WIDTH / 2

    this.sky = this.add
      .tileSprite(0, 0, VIEWPORT_WIDTH, 520, IMAGES.SKY.KEY)
      .setOrigin(0, 0)
      .setScrollFactor(0)

    this.createClouds()

    this.mountains = this.add
      .tileSprite(0, 140, VIEWPORT_WIDTH, 459, IMAGES.MOUNTAINS.KEY)
      .setOrigin(0, 0)
      .setScrollFactor(0)

    this.forest = this.add
      .tileSprite(0, 230, VIEWPORT_WIDTH, 354, IMAGES.FOREST.KEY)
      .setOrigin(0, 0)
      .setScrollFactor(0)

    this.trees = this.add
      .tileSprite(0, -135, VIEWPORT_WIDTH, 720, IMAGES.TREES.KEY)
      .setOrigin(0, 0)
      .setScrollFactor(0)

    this.hills = this.add
      .tileSprite(0, -135, VIEWPORT_WIDTH, 720, IMAGES.TREES_HILLS.KEY)
      .setOrigin(0, 0)
      .setScrollFactor(0)

    this.road = this.add
      .tileSprite(0, 397, VIEWPORT_WIDTH, 96, IMAGES.ROAD.KEY)
      .setOrigin(0, 0)
      .setScrollFactor(0)

    this.guardrail = this.add
      .tileSprite(531, 508, this.WORLD.WIDTH - 531, 36, IMAGES.GUARDRAIL.KEY)
      .setOrigin(0, 0)

    this.grass = this.add
      .tileSprite(0, 479, VIEWPORT_WIDTH, 96, IMAGES.GRASS.KEY)
      .setOrigin(0, 0)
      .setScrollFactor(0)

    this.grassForeground = this.add
      .tileSprite(0, 479, VIEWPORT_WIDTH, 96, IMAGES.GRASS_FOREGROUND.KEY)
      .setOrigin(0, 0)
      .setScrollFactor(0)

    this.platforms = this.physics.add.staticGroup()

    const floor = this.platforms.create(0, 570, IMAGES.FLOOR.KEY, null, false)
    floor.scaleX = 42
    floor.setOrigin(0)
    floor.refreshBody()

    this.add.image(0, 508, IMAGES.BROKEN_GUARDRAIL.KEY).setOrigin(0, 0)

    this.physics.world.setBounds(0, 0, this.WORLD.WIDTH, this.WORLD.HEIGHT)

    this.roadsign = this.physics.add
      .staticImage(700, 485, IMAGES.ROADSIGN.KEY)
      .refreshBody()
      .setInteractive()

    this.pinecone = this.physics.add
      .staticImage(550, 555, IMAGES.PINECONE.KEY)
      .refreshBody()
      .setInteractive()

    this.buggy = new Buggy({
      scene: this,
      x: 2500,
      y: 520,
    })
    this.physics.add.collider(this.platforms, this.buggy)

    this.buggy.setInteractive()
    this.roadCreated = true
  }

  private startPlay() {
    this.startGame()
    this.buggy.play('buggy-parked')
    this.initEngine()
    this.initSurvivor()
    this.setInteractions(['roadsign', 'pinecone', 'buggy'])
    this.cameras.main.startFollow(this.survivor, false, 1, 1, 0, 110)
    this.stopCutscene()
  }

  private initSurvivor() {
    this.survivor = new Survivor({ scene: this, x: 100, y: 510 })

    this.physics.add.collider(this.platforms, this.survivor)

    this.setupInput()
  }

  private initEngine() {
    // should create an invisible shape on top of the engine area of the buggy
  }

  private interactSign() {
    if (!this.playingCutscene) {
      this.survivor.stop()

      this.createDialog('It reads something like… P A … S')

      this.sys.events.off(
        this.interact.roadsign.key,
        this.interact.roadsign.cb,
        this,
        false
      )
    }
  }

  private async interactBuggy() {
    if (!this.playingCutscene) {
      this.survivor.stop()
      this.sys.events.off(
        this.interact.buggy.key,
        this.interact.buggy.cb,
        this,
        false
      )

      this.survivor.body.setCollideWorldBounds(false)
      this.buggy.body.setCollideWorldBounds(false)

      this.survivor.play('backwards')
      await timer(this, 1000)
      await this.createDialog(
        "Hmm that's weird. Nothing seems to be wrong with the engine, it's just not getting any power, the battery is completely dead."
      )
      await timer(this, 700)
      await this.createDialog(
        "Uh, it doesn't look like something that I can fix today. It's getting late so I should find some place to rest anyway."
      )

      this.survivor.faceLeft()
      this.survivor.play('stand')
      await this.createDialog(
        'There is some sort of building down the road. Looks like a good shelter.'
      )

      await this.survivor.moveTo(348, 'left')

      this.survivor.play('push')
      this.buggy.play('buggy-pushed')
      this.survivor.body.setVelocityX(-200)
      this.buggy.body.setVelocityX(-200)
      await cameraFade(this, 'fadeOut')
      this.scene.add(SCENES.BUILDING, BuildingScene, false)
      this.finishScene()
      this.scene.start(SCENES.BUILDING)
    }
  }

  private interactPinecone() {
    if (!this.playingCutscene) {
      this.survivor.stop()

      this.createDialog(
        'Oh, a pine cone! I can get some pine nuts out of that. Will need something to crack open the shell though...'
      )

      this.pickUp('pinecone')

      this.pinecone.destroy()

      this.sys.events.off(
        this.interact.pinecone.key,
        this.interact.pinecone.cb,
        this,
        false
      )
    }
  }
}

export default RoadScene
