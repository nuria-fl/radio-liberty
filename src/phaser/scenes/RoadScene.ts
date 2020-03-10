import { Physics } from 'phaser'
import { BaseScene } from './BaseScene'
import {
  loadSurvivor,
  setupInput,
  preloadSurvivor,
  preloadBuggy
} from '../utils/load'
import { randomLine } from '../default-lines'
import { pickUp } from '../utils/inventory'
import { SCENES, IMAGES, AUDIO } from '../constants'
import Buggy from '../sprites/Buggy'
import BuildingScene from './BuildingScene'

class RoadScene extends BaseScene {
  public interact = {
    roadsign: {
      key: 'lookSign',
      cb: this.interactSign
    },
    buggy: {
      key: 'lookBuggy',
      cb: this.interactBuggy
    },
    pinecone: {
      key: 'lookPinecone',
      cb: this.interactPinecone
    }
  }
  public use = {
    ...this.use,
    roadsign: {
      setText: null,
      name: 'Road sign',
      use: () => {
        this.interactingWithObject = true
        return this.createDialog(randomLine())
      }
    },
    buggy: {
      setText: null,
      name: 'Buggy',
      use: () => {
        this.interactingWithObject = true
        return this.createDialog(randomLine())
      }
    },
    pinecone: {
      setText: null,
      name: 'Pine cone',
      use: () => {
        this.interactingWithObject = true
        return this.createDialog(randomLine())
      }
    }
  }

  private buggy: Buggy
  private platforms: Physics.Arcade.StaticGroup
  private roadsign: Physics.Arcade.Image
  private pinecone: Physics.Arcade.Image
  private engine: any
  private introAudio: Phaser.Sound.BaseSound

  constructor() {
    super({
      key: SCENES.ROAD
    })
  }

  public preload() {
    this.load.audio(AUDIO.INTRO.KEY, `/sound/${AUDIO.INTRO.FILE}`)
    this.load.image(IMAGES.ROADSIGN.KEY, `/images/${IMAGES.ROADSIGN.FILE}`)
    this.load.image(IMAGES.ROAD.KEY, `/images/${IMAGES.ROAD.FILE}`)
    this.load.image(IMAGES.ROAD_LONG.KEY, `/images/${IMAGES.ROAD_LONG.FILE}`)
    this.load.image(IMAGES.FLOOR.KEY, `/images/${IMAGES.FLOOR.FILE}`)
    this.load.image(IMAGES.ROADSIGN.KEY, `/images/${IMAGES.ROADSIGN.FILE}`)
    this.load.image(IMAGES.PINECONE.KEY, `/images/${IMAGES.PINECONE.FILE}`)

    preloadBuggy(this)
    preloadSurvivor(this)
  }

  public create() {
    this.add.image(600, 60, IMAGES.ROAD_LONG.KEY).setOrigin(0)
    const bg = this.add.image(0, 0, IMAGES.ROAD.KEY).setOrigin(0)

    this.platforms = this.physics.add.staticGroup()

    const floor = this.platforms.create(0, 570, IMAGES.FLOOR.KEY, null, false)
    floor.scaleX = 42
    floor.setOrigin(0)
    floor.refreshBody()

    this.initScene()

    this.introAudio = this.sound.add(AUDIO.INTRO.KEY)

    this.introAudio.play()

    this.physics.world.setBounds(0, 0, bg.width * 2, bg.height)

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
      key: IMAGES.BUGGY.KEY,
      x: 2500,
      y: 520
    })
    this.physics.add.collider(this.platforms, this.buggy)

    this.buggy.setInteractive()

    this.cameras.main.setBounds(0, 0, bg.width * 2, 720)
    this.cameras.main.setBackgroundColor('#9fb9b4')
    this.cameras.main.startFollow(this.buggy, false, 1, 1, 0, 120)
    this.cameras.main.fadeIn(3000)
    this.initCutscene()
  }

  public update() {
    if (!this.playingCutscene) {
      this.survivor.update()
    }
  }

  private initCutscene() {
    this.buggy.play('buggy-driving')

    this.tweens.add({
      targets: this.buggy,
      x: 200,
      ease: 'Sine.easeOut',
      duration: 28000,
      yoyo: false,
      repeat: 0,
      onComplete: async () => {
        await this.createDialog('What the…?\n\n(click to continue)')
        this.initGame()
      }
    })
  }

  private initGame() {
    this.startGame()
    this.buggy.play('buggy-parked')
    this.initEngine()
    this.initSurvivor()
    this.setupEvent('roadsign')
    this.setupEvent('pinecone')
    this.setupEvent('buggy')
    this.cameras.main.startFollow(this.survivor, false, 1, 1, 0, 110)
    this.stopCutscene()
  }

  private initSurvivor() {
    this.survivor = loadSurvivor(this)

    this.physics.add.collider(this.platforms, this.survivor)

    setupInput(this.survivor, this)
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
      this.cameras.main.fadeOut(1000, 0, 0, 0, (_, progress) => {
        if (progress === 1) {
          this.scene.add(SCENES.BUILDING, BuildingScene, false)
          this.scene.start(SCENES.BUILDING)
        }
      })
    }
  }

  private interactPinecone() {
    if (!this.playingCutscene) {
      this.survivor.stop()

      this.createDialog(
        'Oh, a pine cone! I can get some pine nuts out of that. Will need something to crack open the shell though...'
      )

      pickUp('pinecone')

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
