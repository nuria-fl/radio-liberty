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
  private survivor: Survivor
  private buggy: Buggy
  private floor: Physics.Arcade.Image
  private roadsign: Physics.Arcade.Image
  private pinecone: Physics.Arcade.Image
  private engine: any

  private look = {
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

  private use = {
    roadsign: {
      setText: null,
      name: 'Road sign'
    },
    buggy: {
      setText: null,
      name: 'Buggy'
    },
    pinecone: {
      setText: null,
      name: 'Pine cone'
    },
    survivor: {
      setText: null,
      name: 'Survivor'
    }
  }

  constructor() {
    super({
      key: SCENES.ROAD
    })
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
    this.initScene()

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

  public activateHovers() {
    this.playingCutscene = true
    const baseText = this.useText.text

    this.survivor.setInteractive()

    const setText = (text: string) => {
      if (this.useText.active) {
        this.useText.setText(text)
      }
    }

    const reset = () => setText(baseText)

    Object.keys(this.use).forEach(key => {
      this.use[key].setText = () => {
        setText(`${baseText} ${this.use[key].name}`)
      }

      this[key].on('pointerover', this.use[key].setText)
      this[key].on('pointerout', reset)
    })

    this.input.on('pointerdown', () => {
      Object.keys(this.use).forEach(key => {
        this[key].off('pointerover', this.use[key].setText)
        this[key].off('pointerout', reset)
        this.use[key].setText = null
      })
      this.survivor.removeInteractive()
      this.useText.destroy()
      this.playingCutscene = false
    })
  }

  private createDialog(text, cb = null) {
    createDialogBox(text, cb, this)
  }

  private initCutscene() {
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

  private initSurvivor() {
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

  private initEngine() {
    // should create an invisible shape on top of the engine area of the buggy
  }

  private lookAtSign() {
    if (!this.playingCutscene) {
      this.survivor.stop()

      this.createDialog('It reads something like… P A … S')

      this.sys.events.off(this.look.sign.key, this.look.sign.cb, this, false)
    }
  }

  private lookAtBuggy() {
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

  private lookAtPinecone() {
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
}

export default RoadScene
