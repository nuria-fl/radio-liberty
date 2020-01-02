import { SCENES, IMAGES } from '../constants'
import Survivor from '../sprites/Survivor'
import { Physics } from 'phaser'
import { pickUp } from '../utils/inventory'
import {
  loadSurvivor,
  setupInput,
  preloadBuggy,
  preloadSurvivor,
  preloadStranger
} from '../utils/load'
import { BaseScene } from './BaseScene'
import { randomLine } from '../default-lines'
import Buggy from '../sprites/Buggy'
import Stranger from '../sprites/Stranger'

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
    },
    puddle: {
      setText: null,
      name: 'Puddle',
      use: () => {
        this.interactingWithObject = true
        if (this.currentObject.id === 'bucket') {
          return this.setUpWaterCollector()
        }
        return this.createDialog(randomLine())
      }
    },
    wall: {
      setText: null,
      name: 'Wall',
      use: () => {
        this.interactingWithObject = true
        return this.createDialog(randomLine())
      }
    },
    pit: {
      setText: null,
      name: 'Pit',
      use: () => {
        this.interactingWithObject = true
        if (this.currentObject.id === 'wood') {
          return this.setUpFire()
        }
        return this.createDialog(randomLine())
      }
    },
    wood: {
      setText: null,
      name: 'Wood',
      use: () => {
        this.interactingWithObject = true
        return this.createDialog(randomLine())
      }
    },
    rock: {
      setText: null,
      name: 'Rock',
      use: () => {
        this.interactingWithObject = true
        if (this.currentObject.id === 'pinecone') {
          return this.getNuts()
        }
        return this.createDialog(randomLine())
      }
    },
    stranger: {
      setText: null,
      name: 'Stranger',
      use: () => {
        this.interactingWithObject = true

        if (this.currentObject.id === 'taser') {
          return this.finishEncounter()
        }
        return this.createDialog(randomLine())
      }
    }
  }

  public survivor: Survivor
  public buggy: Buggy
  public stranger: Stranger
  public platforms: Physics.Arcade.StaticGroup
  public upstairsFloor: Physics.Arcade.Sprite
  public floor: Physics.Arcade.Sprite
  public engine: any
  public ladder: Physics.Arcade.Image
  public bucket: Physics.Arcade.Image
  public waterCollector: Physics.Arcade.Image
  public wood: Physics.Arcade.Image
  public puddle: Physics.Arcade.Image
  public pit: Physics.Arcade.Image
  public wall: Physics.Arcade.Image
  public antennas: Physics.Arcade.Image
  public rock: Physics.Arcade.Image
  public drop: Phaser.GameObjects.Image
  public dropAnimation: Phaser.Tweens.Tween
  public isUpstairs = false
  public hasWaterCollector = false
  public hasFire = false
  public encounterHappened = false

  public interact = {
    buggy: {
      key: 'interactBuggy',
      cb: this.interactBuggy
    },
    bucket: {
      key: 'interactBucket',
      cb: this.interactBucket
    },
    ladder: {
      key: 'interactLadder',
      cb: this.interactLadder,
      permanent: true
    },
    wood: {
      key: 'interactWood',
      cb: this.interactWood
    },
    rock: {
      key: 'interactRock',
      cb: this.interactRock
    },
    puddle: {
      key: 'interactPuddle',
      cb: this.interactPuddle
    },
    wall: {
      key: 'interactWall',
      cb: this.interactWall
    },
    pit: {
      key: 'interactPit',
      cb: this.interactPit
    },
    antennas: {
      key: 'interactAntennas',
      cb: this.interactAntennas
    }
  }

  private timeout: number

  constructor() {
    super({
      key: SCENES.BUILDING
    })
  }

  public initCutscene() {
    this.createDialog(
      "Hm, doesn't look like anyone is been here for some time, but I bet I can find something useful lying around. I should start a fire and find some food and water, I'm running low"
    )
  }

  public initSurvivor() {
    this.survivor = loadSurvivor(this, 300, 625)

    this.physics.add.collider(
      this.platforms,
      this.survivor,
      (survivor: Survivor, platform: Physics.Arcade.Sprite) => {
        if (platform.y > 600 && this.isUpstairs) {
          this.isUpstairs = false
          this.sys.events.off(
            this.interact.ladder.key,
            this.interact.ladder.cb,
            this,
            false
          )
        } else if (survivor.body.y < 350 && !this.isUpstairs) {
          this.isUpstairs = true
          this.sys.events.off(
            this.interact.ladder.key,
            this.interact.ladder.cb,
            this,
            false
          )
        }
      }
    )

    setupInput(this.survivor, this)
  }

  public initStranger() {
    this.stranger = new Stranger({
      scene: this,
      key: IMAGES.STRANGER.KEY,
      x: 750,
      y: 340
    })
    this.stranger.setInteractive()
    this.physics.add.collider(this.platforms, this.stranger)
  }

  public preload() {
    this.load.image(IMAGES.BUILDING.KEY, `/images/${IMAGES.BUILDING.FILE}`)
    this.load.image(IMAGES.FLOOR.KEY, `/images/${IMAGES.FLOOR.FILE}`)
    this.load.image(IMAGES.LADDER.KEY, `/images/${IMAGES.LADDER.FILE}`)
    this.load.image(IMAGES.BOXES.KEY, `/images/${IMAGES.BOXES.FILE}`)
    this.load.image(IMAGES.BUCKET.KEY, `/images/${IMAGES.BUCKET.FILE}`)
    this.load.image(IMAGES.WOOD.KEY, `/images/${IMAGES.WOOD.FILE}`)
    this.load.image(IMAGES.CLOTH.KEY, `/images/${IMAGES.CLOTH.FILE}`)
    this.load.image(IMAGES.DROP.KEY, `/images/${IMAGES.DROP.FILE}`)
    this.load.image(IMAGES.ROCK.KEY, `/images/${IMAGES.ROCK.FILE}`)
    preloadBuggy(this)
    preloadSurvivor(this)
    preloadStranger(this)
  }

  public create() {
    this.initScene()

    const bg = this.add.image(0, 0, IMAGES.BUILDING.KEY).setOrigin(0)

    this.physics.world.setBounds(0, 0, bg.width, bg.height)

    this.platforms = this.physics.add.staticGroup()

    const floor = this.platforms
      .create(0, 684, IMAGES.FLOOR.KEY, null, false)
      .setOrigin(0)
    floor.scaleX = bg.width / 30
    floor.refreshBody()

    this.platforms.create(680, 365, IMAGES.FLOOR.KEY, null, false)
    this.platforms.create(1278, 365, IMAGES.FLOOR.KEY, null, false)

    this.upstairsFloor = this.platforms
      .create(710, 395, IMAGES.FLOOR.KEY, null, false)
      .setOrigin(0)
    this.upstairsFloor.scaleX = 9
    this.upstairsFloor.refreshBody()

    this.upstairsFloor.body.checkCollision.down = false

    this.ladder = this.physics.add
      .staticImage(1130, 532, IMAGES.LADDER.KEY)
      .refreshBody()
      .setInteractive()

    this.bucket = this.physics.add
      .staticImage(1200, 660, IMAGES.BUCKET.KEY)
      .refreshBody()
      .setInteractive()

    this.rock = this.physics.add
      .staticImage(415, 625, IMAGES.ROCK.KEY)
      .refreshBody()
      .setInteractive()

    this.puddle = this.physics.add
      .staticImage(600, 700, IMAGES.FLOOR.KEY)
      .setScale(1.5, 0.9)
      .setAlpha(0, 0, 0, 0)
      .refreshBody()
      .setInteractive()

    this.pit = this.physics.add
      .staticImage(885, 660, IMAGES.FLOOR.KEY)
      .setScale(1.5, 0.9)
      .setAlpha(0, 0, 0, 0)
      .refreshBody()
      .setInteractive()

    this.wall = this.physics.add
      .staticImage(935, 540, IMAGES.FLOOR.KEY)
      .setScale(4, 2)
      .setAlpha(0, 0, 0, 0)
      .refreshBody()
      .setInteractive()

    this.antennas = this.physics.add
      .staticImage(180, 325, IMAGES.FLOOR.KEY)
      .setScale(5.8, 8)
      .setAlpha(0, 0, 0, 0)
      .refreshBody()
      .setInteractive()

    this.initSurvivor()

    this.initStranger()

    this.wood = this.physics.add
      .staticImage(820, 340, IMAGES.WOOD.KEY)
      .refreshBody()
      .setInteractive()

    this.physics.add.staticImage(771, 322, IMAGES.BOXES.KEY)

    this.drop = this.add.image(600, 428, IMAGES.DROP.KEY).setOrigin(0)

    this.dropAnimation = this.tweens.add({
      targets: this.drop,
      y: '+=250',
      ease: 'Linear',
      duration: 600,
      repeatDelay: 2000,
      repeat: -1, // infinity
      yoyo: false
    })

    this.buggy = new Buggy({
      scene: this,
      key: IMAGES.BUGGY.KEY,
      x: 100,
      y: 600
    })
    this.buggy.play('buggy-parked')
    this.physics.add.collider(this.platforms, this.buggy)
    this.buggy.setInteractive()

    this.setupEvent('bucket')
    this.setupEvent('ladder')
    this.setupEvent('wood')
    this.setupEvent('puddle')
    this.setupEvent('wall')
    this.setupEvent('pit')
    this.setupEvent('antennas')
    this.setupEvent('buggy')
    this.setupEvent('rock')

    this.wood.on('pointerup', () => {
      if (!this.encounterHappened) {
        this.startEncounter()
      }
    })

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
    this.physics.world.gravity.y = 800
    this.survivor.update()
  }

  private startEncounter() {
    this.survivor.stop()
    this.startCutscene()

    this.survivor.moveTo(1000, 'left').then(() => {
      const dialog1 = () => this.createDialog('Oh… Hello', dialog2)
      const dialog2 = () => {
        this.tweens.add({
          targets: this.stranger,
          x: 880,
          duration: 1000,
          onComplete: () => {
            this.createDialog('* Growl *', dialog3)
          }
        })
      }
      const dialog3 = () =>
        this.createDialog(
          "Uhm… I'm sorry, I thought the place was abandoned, my car broke down and… eh…",
          () => this.survivor.moveTo(1050, 'left').then(dialog4)
        )

      const dialog4 = () =>
        this.createDialog("I don't think I can reason with him.", () => {
          this.survivor.immobilize()
          this.encounterHappened = true

          this.timeout = setTimeout(() => {
            this.strangerAttack().then(() => {
              this.survivor.die()
            })
          }, 10000)
        })

      this.tweens.add({
        targets: this.stranger,
        x: 820,
        duration: 1000,
        onComplete: () => {
          this.createDialog('* Growl *', dialog1)
        }
      })
    })
  }

  private strangerAttack() {
    return new Promise(resolve => {
      this.tweens.add({
        targets: this.stranger,
        x: 1000,
        duration: 10
      })
      this.cameras.main.flash(500, 255, 0, 0, true, (_, progress) => {
        if (progress === 1) {
          resolve()
        }
      })
    })
  }

  private finishEncounter() {
    clearTimeout(this.timeout)

    this.strangerAttack().then(() => {
      setTimeout(() => {
        // radio sound
        this.tweens.add({
          targets: this.stranger,
          x: 0,
          duration: 1000,
          onComplete: () => {
            this.stranger.destroy()
            this.survivor.recover()
            document.dispatchEvent(new CustomEvent('getHurt'))
            this.createDialog('... What did just happen?', () =>
              this.createDialog(
                "Ugh… No time to think about that, I'm losing a lot of blood."
              )
            )
          }
        })
      }, 3000)
    })
  }

  private interactBucket() {
    if (!this.playingCutscene) {
      this.survivor.stop()

      this.createDialog('A bucket. Convenient.')

      pickUp('bucket')

      this.bucket.destroy()
    }
  }

  private interactWood() {
    if (!this.playingCutscene) {
      this.survivor.stop()

      this.createDialog('Dry wood, lucky me!')

      pickUp('wood')

      this.wood.destroy()
    }
  }

  private interactLadder() {
    if (!this.playingCutscene) {
      this.survivor.stop()

      if (this.isUpstairs) {
        this.upstairsFloor.body.checkCollision.up = false
        this.survivor.body.setVelocityY(400)
      } else {
        this.upstairsFloor.body.checkCollision.up = true
        this.physics.world.gravity.y = 0
        this.survivor.body.setVelocityY(-400)
      }
    }
  }

  private setUpWaterCollector() {
    this.startCutscene()
    this.survivor.moveTo(650, 'left').then(() => {
      if (!this.hasWaterCollector) {
        this.survivor.stop()
        this.removeItem({ id: 'bucket' })
        this.waterCollector = this.physics.add
          .staticImage(605, 665, IMAGES.BUCKET.KEY)
          .refreshBody()
          .setInteractive()
        this.createDialog('Water collector set!')
        this.hasWaterCollector = true
      }
    })
  }

  private setUpFire() {
    this.startCutscene()
    this.survivor.moveTo(885, 'left').then(() => {
      if (!this.hasFire) {
        this.survivor.stop()
        this.removeItem({ id: 'wood' })
        // TODO: Add fire sprite
        this.createDialog('Fire is burning!')
        this.hasFire = true
      }
    })
  }

  private interactPuddle() {
    if (this.hasWaterCollector) {
      this.createDialog('It will be full in a while.')
    } else {
      this.createDialog('So much water lost...')
    }
  }

  private interactWall() {
    this.createDialog(
      'Someone has written the name "Libby" all over the wall... Geez, what a creep.'
    )
  }

  private interactPit() {
    if (this.hasFire) {
      this.createDialog('It should last all night.')
    } else {
      this.createDialog(
        'Perfect place to build a fire, if I can find something to burn'
      )
    }
  }

  private interactAntennas() {
    const focusBack = () => {
      this.cameras.main.pan(
        this.survivor.x,
        this.survivor.y,
        1000,
        'Linear',
        false,
        (_, progress) => {
          if (progress === 1) {
            this.cameras.main.startFollow(this.survivor)
            this.stopCutscene()
          }
        }
      )
    }
    this.startCutscene()
    this.cameras.main.stopFollow()
    this.cameras.main.pan(0, 0, 1000, 'Linear', false, (_, progress) => {
      if (progress === 1) {
        this.createDialog(
          'Hmm, looks like they are active. I wonder what they are for.',
          focusBack
        )
      }
    })
  }

  private interactBuggy() {
    this.createDialog('Not much more I can do to fix it today.')
  }

  private interactRock() {
    this.createDialog("I don't want to carry a rock around.")
  }

  private getNuts() {
    this.startCutscene()
    this.survivor.setDestination(415)
    this.physics.moveTo(this.survivor, 415, this.survivor.y, 100)

    const crackNuts = () => {
      this.survivor.stop()
      this.removeItem({ id: 'pinecone' })
      pickUp('nuts')
      this.createDialog('Yes! Delicious pine nuts')

      this.sys.events.off('crackNuts', crackNuts, this, false)
    }

    this.sys.events.on('crackNuts', crackNuts, this)
    this.physics.add.overlap(this.survivor, this.rock, () => {
      this.sys.events.emit('crackNuts')
    })
  }
}

export default BuildingScene
