import { SCENES, IMAGES } from '../constants'
import Survivor from '../sprites/Survivor'
import createSpeechBubble from '../utils/createSpeechBubble'
import { Physics } from 'phaser'

class BuildingScene extends Phaser.Scene {
  survivor: Survivor
  floor: Physics.Arcade.Image
  engine: any
  playingCutscene = true

  look = {
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

  initCutscene() {
    this.initSurvivor()

    createSpeechBubble(
      {
        width: 280,
        height: 160,
        quote:
          "Hm, doesn't look like anyone is been here for some time, but I bet I can find something useful lying around. I should start a fire and find some food and water, I'm running low"
      },
      this.survivor.body,
      this
    )
  }

  initSurvivor() {
    this.survivor = new Survivor({
      scene: this,
      key: IMAGES.SURVIVOR.KEY,
      x: 100,
      y: 366
    })
    this.physics.add.collider(this.floor, this.survivor)
    // this.physics.add.overlap(this.survivor, this.roadsign, () => {
    //   this.sys.events.emit(this.look.sign.key)
    // })

    this.input.on('pointerdown', pointer => {
      if (this.playingCutscene === false) {
        this.survivor.setDestination(pointer.downX)
        this.physics.moveTo(this.survivor, pointer.downX, this.survivor.y, 100)
      }
    })
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

  preload() {
    this.load.image(
      IMAGES.ROADSIGN.KEY,
      `assets/images/${IMAGES.ROADSIGN.FILE}`
    )
    this.load.image(IMAGES.ROAD.KEY, `assets/images/${IMAGES.ROAD.FILE}`)
    this.load.image(IMAGES.FLOOR.KEY, `assets/images/${IMAGES.FLOOR.FILE}`)
    this.load.image(
      IMAGES.ROADSIGN.KEY,
      `assets/images/${IMAGES.ROADSIGN.FILE}`
    )
    this.load.spritesheet(
      IMAGES.BUGGY.KEY,
      `assets/images/${IMAGES.BUGGY.FILE}`,
      {
        frameWidth: 194,
        frameHeight: 104
      }
    )

    this.load.spritesheet(
      IMAGES.SURVIVOR.KEY,
      `assets/images/${IMAGES.SURVIVOR.FILE}`,
      {
        frameWidth: 37,
        frameHeight: 88
      }
    )
  }

  create() {
    const bg = this.add.image(0, 0, IMAGES.ROAD.KEY).setOrigin(0)
    bg.setDisplaySize(this.game.canvas.width, this.game.canvas.height)

    this.floor = this.physics.add
      .staticImage(0, 412, IMAGES.FLOOR.KEY)
      .setOrigin(0, 0)
      .refreshBody()

    this.initCutscene()
  }

  update() {
    if (!this.playingCutscene) {
      this.survivor.update()
    }
  }
}

export default BuildingScene
