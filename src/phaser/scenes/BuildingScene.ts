import { SCENES, IMAGES } from '../constants'
import Survivor from '../sprites/Survivor'
import { Physics } from 'phaser'
import { pickUp } from '../utils/inventory'
import { createDialogBox } from '../utils/dialog'
import {
  loadSurvivor,
  setupInput,
  preloadBuggy,
  preloadSurvivor
} from '../utils/load'
import { BaseScene } from './BaseScene'
import { randomLine } from '../default-lines'

class BuildingScene extends BaseScene {
  public use = {
    ...this.use,
    buggy: {
      setText: null,
      name: 'Buggy',
      use: () => {
        this.interactingWithObject = true
        return this.createDialog(randomLine())
      }
    },
    ladder: {
      setText: null,
      name: 'Ladder',
      use: () => {
        this.interactingWithObject = true
        return this.createDialog(randomLine())
      }
    },
    bucket: {
      setText: null,
      name: 'Bucket',
      use: () => {
        this.interactingWithObject = true
        return this.createDialog(randomLine())
      }
    }
  }

  public survivor: Survivor
  public floor: Physics.Arcade.Image
  public engine: any
  public ladder: Physics.Arcade.Image
  public bucket: Physics.Arcade.Image

  public interact = {
    // buggy: {
    //   key: 'interactBuggy',
    //   cb: this.interactAtBuggy
    // }
    bucket: {
      key: 'interactBucket',
      cb: this.interactBucket
    },
    ladder: {
      key: 'interactLadder',
      cb: this.interactLadder
    }
  }

  constructor() {
    super({
      key: SCENES.BUILDING
    })
  }

  public createDialog(text, cb = null) {
    createDialogBox(text, cb, this)
  }

  public initCutscene() {
    this.createDialog(
      "Hm, doesn't look like anyone is been here for some time, but I bet I can find something useful lying around. I should start a fire and find some food and water, I'm running low"
    )
  }

  public initSurvivor() {
    this.survivor = loadSurvivor(this, 1000, 625)

    this.physics.add.collider(this.floor, this.survivor)

    this.physics.add.overlap(this.survivor, this.bucket, () => {
      this.sys.events.emit(this.interact.bucket.key)
    })
    this.physics.add.overlap(this.survivor, this.ladder, () => {
      this.sys.events.emit(this.interact.ladder.key)
    })

    setupInput(this.survivor, this)
  }

  public preload() {
    this.load.image(IMAGES.BUILDING.KEY, `/images/${IMAGES.BUILDING.FILE}`)
    this.load.image(IMAGES.FLOOR.KEY, `/images/${IMAGES.FLOOR.FILE}`)
    this.load.image(IMAGES.LADDER.KEY, `/images/${IMAGES.LADDER.FILE}`)
    this.load.image(IMAGES.BUCKET.KEY, `/images/${IMAGES.BUCKET.FILE}`)
    preloadBuggy(this)
    preloadSurvivor(this)
  }

  public create() {
    this.initScene()

    const bg = this.add.image(0, 0, IMAGES.BUILDING.KEY).setOrigin(0)

    this.physics.world.setBounds(0, 0, bg.width, bg.height)

    this.floor = this.physics.add
      .staticImage(0, 684, IMAGES.FLOOR.KEY)
      .setOrigin(0, 0)
      .refreshBody()

    this.ladder = this.physics.add
      .staticImage(1130, 532, IMAGES.LADDER.KEY)
      .refreshBody()
      .setInteractive()

    this.bucket = this.physics.add
      .staticImage(1200, 660, IMAGES.BUCKET.KEY)
      .refreshBody()
      .setInteractive()

    this.bucket.on('pointerup', () => {
      if (!this.playingCutscene) {
        this.sys.events.on(
          this.interact.bucket.key,
          this.interact.bucket.cb,
          this
        )
      }
    })

    this.ladder.on('pointerup', () => {
      if (!this.playingCutscene) {
        this.sys.events.on(
          this.interact.ladder.key,
          this.interact.ladder.cb,
          this
        )
      }
    })

    this.initSurvivor()

    this.cameras.main.setBounds(0, 0, 1280, 800)
    this.cameras.main.fadeIn()

    setTimeout(() => {
      this.cameras.main.pan(
        this.survivor.x,
        this.survivor.y,
        4000,
        'Linear',
        false,
        (_, progress) => {
          if (progress === 1) {
            this.cameras.main.startFollow(this.survivor)

            this.initCutscene()
          }
        }
      )
    }, 700)
  }

  public update() {
    if (!this.playingCutscene) {
      this.survivor.update()
    }
  }

  private interactBucket() {
    if (!this.playingCutscene) {
      this.survivor.stop()

      pickUp('bucket')

      this.bucket.destroy()

      this.sys.events.off(
        this.interact.bucket.key,
        this.interact.bucket.cb,
        this,
        false
      )
    }
  }

  private interactLadder() {
    if (!this.playingCutscene) {
      this.survivor.stop()

      console.log('go up/down')

      this.sys.events.off(
        this.interact.ladder.key,
        this.interact.ladder.cb,
        this,
        false
      )
    }
  }
}

export default BuildingScene
