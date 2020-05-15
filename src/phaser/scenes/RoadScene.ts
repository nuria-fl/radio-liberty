import PathFollower from 'phaser3-rex-plugins/plugins/pathfollower.js'
import { Physics } from 'phaser'
import { BaseScene } from './BaseScene'
import { randomLine } from '../default-lines'
import { SCENES, IMAGES, AUDIO, SPRITES } from '../constants'
import { Survivor } from '../sprites/Survivor'
import { Buggy } from '../sprites/Buggy'
import BuildingScene from './BuildingScene'
import { cameraFade, cameraPan, timer } from '../utils/promisify'

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
    this.loadImage(IMAGES.ROAD_WINDOW)
    this.loadImage(IMAGES.ROAD)
    this.loadImage(IMAGES.SKY)
    this.loadImage(IMAGES.TINY_BUGGY)
    this.loadImage(IMAGES.TREES_HILLS)

    // Preload sprites
    this.loadSprite(SPRITES.BUGGY)
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
    // const graphics = this.add
    //   .graphics({
    //     lineStyle: {
    //       width: 3,
    //       color: 0x00701a,
    //       alpha: 1,
    //     },
    //   })
    //   .setDepth(2)
    // path.draw(graphics)

    tinyBuggy.pathFollower = new PathFollower(tinyBuggy, {
      path: path,
      t: 0,
      rotateToPath: true,
    })

    // this.tweens.add({
    //   targets: tinyBuggy.pathFollower,
    //   t: 1,
    //   ease: 'Linear', // 'Cubic', 'Elastic', 'Bounce', 'Back'
    //   duration: 3000,
    //   repeat: -1,
    //   yoyo: false,
    // })
    await timer(this, 1000)
    this.createNarratorDialog(
      "It's been a few hundred years since the end of the world.\n\nClimate change caused floods, draughts, hurricanes.\n\nEconomy collapsed. All was lₒst.",
      false
    )
    let dialog1 = false
    let dialog2 = false
    let done = false
    let image: Phaser.GameObjects.Image
    let radio
    await timer(this, 6000)
    this.tweens.add({
      targets: tinyBuggy.pathFollower,
      t: 1,
      ease: 'Linear',
      duration: 25000,
      yoyo: false,
      repeat: 0,
      onUpdate: ({ progress }) => {
        if (progress > 0.05 && !image) {
          image = this.add.image(400, 400, IMAGES.ROAD_WINDOW.KEY).setDepth(1)
        }

        if (progress > 0.15 && !dialog1) {
          dialog1 = true
          this.createNarratorDialog(
            'People alw̴ays find a wa̶y to survive, t̶ho̴u̸gh.\n\nSome people geΓ by scavenging for supₚlies.\n\nOth■rs, stealiₚg and killiⁿg t̶hem.',
            false
          )
        }

        if (progress > 0.25 && progress < 0.26) {
          this.cameras.main.flash(100)
        }

        if (progress > 0.3 && !radio) {
          this.cameras.main.flash(100)
          image.setAlpha(0, 0, 0, 0)
          radio = this.add
            .image(400, 400, IMAGES.RADIO.KEY)
            .setScale(0.3, 0.3)
            .setDepth(1)
            .setScrollFactor(0)
        }

        if (progress > 0.4 && progress < 0.407) {
          this.cameras.main.flash(100)
          this.cameras.main.shake(150, 0.02)
        }

        if (progress > 0.5 && !dialog2) {
          dialog2 = true
          this.createNarratorDialog(
            'Oₚr survivₒr ₚₚ ha̶s be⍰n ₚ✝︎ra̶v3#ₚliⁿქ ནhპ ⎍␡ cₚქₚt\n\n☓∑⌗  ̷of ✦ᵤrₒₚₑ, ₚl⍰■e ᶠᶦⁿ◀︎ᵈing a wₚ ⚈ₚay ◗ to  s̶t̶ay̶ a̶livₚ ͕̱',
            false
          )
          radio.destroy()
          image.setAlpha(1, 1, 1, 1)
          this.cameras.main.shake(100, 0.02)
          this.cameras.main.flash(50)
        }

        if (progress > 0.56 && progress < 0.57) {
          this.cameras.main.flash(100)
          this.cameras.main.shake(150, 0.02)
        }

        if (progress > 0.65 && progress < 0.66) {
          this.cameras.main.flash(100)
          this.cameras.main.shake(100, 0.02)
        }

        if (progress > 0.69 && progress < 0.7) {
          this.cameras.main.flash(50)
        }

        if (progress > 0.72 && progress < 0.73) {
          this.cameras.main.flash(100)
          this.cameras.main.shake(150, 0.02)
          this.cameras.main.flash(50)
        }

        if (progress > 0.8 && !done) {
          done = true
          image.destroy()
          this.cameras.main.flash(50)
          this.cameras.main.shake(100, 0.02)
          this.tweens.add({
            targets: [view, tinyBuggy],
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
          // destroying the tinyBuggy causes some issue with the path follower plugin
          // tinyBuggy.destroy()
        }
      },
    })
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

      await this.createDialog(
        "Hmm that's weird. Nothing seems to be wrong with the engine, it's just not getting any power, the battery is completely dead."
      )
      await this.createDialog(
        "Uh, it doesn't look like something that I can fix today. It's getting late so I should find some place to rest anyway."
      )
      await this.createDialog(
        "There is some sort of building down the road. Looks like a good shelter, I can push the buggy to there, doesn't look too far"
      )

      await this.survivor.moveTo(348, 'left')

      this.survivor.play('push')
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
