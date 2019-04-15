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

class BuildingScene extends BaseScene {
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
    this.initSurvivor()

    this.createDialog(
      'Hm, doesn\'t look like anyone is been here for some time, but I bet I can find something useful lying around. I should start a fire and find some food and water, I\'m running low'
    )
  }

  public initSurvivor() {
    this.survivor = loadSurvivor(this, 500)

    this.physics.add.collider(this.floor, this.survivor)
    // this.physics.add.overlap(this.survivor, this.roadsign, () => {
    //   this.sys.events.emit(this.look.sign.key)
    // })

    setupInput(this.survivor, this)
  }

  // lookAtSign() {
  //   this.survivor.stop()

  //   createSpeechBubble(
  //     {
  //       width: 300,
  //       height: 80,
  //       quote: 'It reads something like… P A … S'
  //     },
  //     this.survivor.body,
  //     this
  //   )

  //   this.sys.events.off(this.look.sign.key, this.look.sign.cb, this, false)
  // }

  public preload() {
    this.load.image(IMAGES.ROADSIGN.KEY, `/images/${IMAGES.ROADSIGN.FILE}`)
    this.load.image(IMAGES.ROAD.KEY, `/images/${IMAGES.ROAD.FILE}`)
    this.load.image(IMAGES.FLOOR.KEY, `/images/${IMAGES.FLOOR.FILE}`)
    this.load.image(IMAGES.ROADSIGN.KEY, `/images/${IMAGES.ROADSIGN.FILE}`)
    preloadBuggy(this)
    preloadSurvivor(this)
  }

  public create() {
    this.dialog = new DialogService(this)

    const bg = this.add.image(0, 0, IMAGES.ROAD.KEY).setOrigin(0)
    bg.setDisplaySize(this.game.canvas.width, this.game.canvas.height)

    this.floor = this.physics.add
      .staticImage(0, 412, IMAGES.FLOOR.KEY)
      .setOrigin(0, 0)
      .refreshBody()

    this.initCutscene()
  }

  public update() {
    if (!this.playingCutscene) {
      this.survivor.update()
    }
  }
}

export default BuildingScene
