import { Physics } from 'phaser'
import { BaseScene } from './BaseScene'
import { DialogService, createDialogBox } from '../utils/dialog'
import {
  loadSurvivor,
  setupInput,
  preloadSurvivor,
  preloadBuggy
} from '../utils/load'
import { pickUp } from '../utils/inventory'
import { SCENES, IMAGES, AUDIO } from '../constants'
import Survivor from '../sprites/Survivor'
import Buggy from '../sprites/Buggy'
import BuildingScene from './BuildingScene'

class RoadScene extends BaseScene {
  public survivor: Survivor
  public buggy: Buggy
  public floor: Physics.Arcade.Image
  public roadsign: Physics.Arcade.Image
  public pinecone: Physics.Arcade.Image
  public engine: any

  public look = {
    sign: {
      key: 'lookSign',
      cb: this.lookAtSign
    },
    buggy: {
      key: 'lookBuggy',
      cb: this.lookAtBuggy
    },
    pinecone: {
      key: 'lookPinecone',
      cb: this.lookAtPinecone
    }
  }

  constructor() {
    super({
      key: SCENES.ROAD
    })
  }

  public createDialog(text, cb = null) {
    createDialogBox(text, cb, this)
  }

  public initCutscene() {
    this.buggy = new Buggy({
      scene: this,
      key: IMAGES.BUGGY.KEY,
      x: 1000,
      y: 359
    })
    this.physics.add.collider(this.floor, this.buggy)

    this.buggy.setInteractive()
    this.buggy.on('pointerup', () => {
      if (!this.playingCutscene) {
        this.sys.events.on(this.look.buggy.key, this.look.buggy.cb, this)
      }
    })

    this.buggy.play('buggy-driving')

    this.tweens.add({
      targets: this.buggy,
      x: 200,
      ease: 'Power1',
      duration: 3000,
      yoyo: false,
      repeat: 0,
      onComplete: () => {
        const finishCutscene = () => {
          this.buggy.play('buggy-parked')
          this.initEngine()
          this.initSurvivor()
        }
        this.createDialog('What the…?', finishCutscene)
      }
    })
  }

  public initSurvivor() {
    this.survivor = loadSurvivor(this)

    this.physics.add.collider(this.floor, this.survivor)
    this.physics.add.overlap(this.survivor, this.roadsign, () => {
      this.sys.events.emit(this.look.sign.key)
    })

    this.physics.add.overlap(this.survivor, this.pinecone, () => {
      this.sys.events.emit(this.look.pinecone.key)
    })

    // this should be with the buggy engine instead
    this.physics.add.overlap(this.survivor, this.buggy, () => {
      this.sys.events.emit(this.look.buggy.key)
    })

    setupInput(this.survivor, this)
  }

  public initEngine() {
    // should create an invisible shape on top of the engine area of the buggy
  }

  public lookAtSign() {
    if (!this.playingCutscene) {
      this.survivor.stop()

      this.createDialog('It reads something like… P A … S')

      this.sys.events.off(this.look.sign.key, this.look.sign.cb, this, false)
    }
  }

  public lookAtBuggy() {
    const speech = [
      "Hmm that's weird. Nothing seems to be wrong with the engine, it's just not getting any power, the battery is completely dead.",
      "Uh, it doesn't look like something that I can fix today. It's getting late so I should find some place to rest anyway.",
      "There is some sort of building down the road. Looks like a good shelter, I can push the buggy to there, doesn't look too far"
    ]

    const startFinishCutscene = () => {
      this.createDialog(speech[0], dialog2)
    }

    const dialog2 = () => {
      this.createDialog(speech[1], dialog3)
    }

    const dialog3 = () => {
      this.createDialog(speech[2], finishCutscene)
    }

    const finishCutscene = () => {
      this.tweens.add({
        targets: this.buggy,
        x: -200,
        ease: 'Power1',
        duration: 3000,
        yoyo: false,
        repeat: 0,
        onComplete: () => {
          this.scene.add(SCENES.BUILDING, BuildingScene, false)
          this.scene.start(SCENES.BUILDING)
        }
      })

      this.tweens.add({
        targets: this.survivor,
        x: -200,
        ease: 'Power1',
        duration: 3000,
        yoyo: false,
        repeat: 0
      })
    }

    if (!this.playingCutscene) {
      this.survivor.stop()
      this.sys.events.off(this.look.buggy.key, this.look.buggy.cb, this, false)

      startFinishCutscene()
    }
  }

  public lookAtPinecone() {
    if (!this.playingCutscene) {
      this.survivor.stop()

      this.createDialog(
        'Oh, a pine cone! I can get some pine nuts out of that. Will need something to crack open the shell though...'
      )

      pickUp('pinecone')

      this.pinecone.destroy()

      this.sys.events.off(
        this.look.pinecone.key,
        this.look.pinecone.cb,
        this,
        false
      )
    }
  }

  public preload() {
    this.load.image(IMAGES.ROADSIGN.KEY, `/images/${IMAGES.ROADSIGN.FILE}`)
    this.load.image(IMAGES.ROAD.KEY, `/images/${IMAGES.ROAD.FILE}`)
    this.load.image(IMAGES.FLOOR.KEY, `/images/${IMAGES.FLOOR.FILE}`)
    this.load.image(IMAGES.ROADSIGN.KEY, `/images/${IMAGES.ROADSIGN.FILE}`)
    this.load.image(IMAGES.PINECONE.KEY, `/images/${IMAGES.PINECONE.FILE}`)

    preloadBuggy(this)
    preloadSurvivor(this)
  }

  public create() {
    this.listenForGameOver()

    this.dialog = new DialogService(this)

    const bg = this.add.image(0, 0, IMAGES.ROAD.KEY).setOrigin(0)
    bg.setDisplaySize(this.game.canvas.width, this.game.canvas.height)

    this.floor = this.physics.add
      .staticImage(0, 412, IMAGES.FLOOR.KEY)
      .setOrigin(0, 0)
      .refreshBody()

    this.roadsign = this.physics.add
      .staticImage(660, 360, IMAGES.ROADSIGN.KEY)
      .refreshBody()
      .setInteractive()

    this.roadsign.on('pointerup', () => {
      if (!this.playingCutscene) {
        this.sys.events.on(this.look.sign.key, this.look.sign.cb, this)
      }
    })

    this.pinecone = this.physics.add
      .staticImage(550, 420, IMAGES.PINECONE.KEY)
      .refreshBody()
      .setInteractive()

    this.pinecone.on('pointerup', () => {
      if (!this.playingCutscene) {
        this.sys.events.on(this.look.pinecone.key, this.look.pinecone.cb, this)
      }
    })

    this.initCutscene()
  }

  public update() {
    if (!this.playingCutscene) {
      this.survivor.update()
    }
  }
}

export default RoadScene
