import { SCENES, IMAGES } from '../constants'
import Survivor from '../sprites/Survivor'
import { Physics } from 'phaser'
import { DialogService, createDialogBox } from '../utils/dialog'
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
    }
  }

  public survivor: Survivor
  public floor: Physics.Arcade.Image
  public engine: any

  public look = {
    // buggy: {
    //   key: 'lookBuggy',
    //   cb: this.lookAtBuggy
    // }
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

    setupInput(this.survivor, this)
  }

  public preload() {
    this.load.image(IMAGES.BUILDING.KEY, `/images/${IMAGES.BUILDING.FILE}`)
    this.load.image(IMAGES.FLOOR.KEY, `/images/${IMAGES.FLOOR.FILE}`)
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
}

export default BuildingScene
