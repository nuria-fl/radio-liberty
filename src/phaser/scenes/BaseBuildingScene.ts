import { Physics } from 'phaser'
import { IMAGES, AUDIO, SPRITES } from '../constants'
import { Survivor } from '../sprites/Survivor'
import { Buggy } from '../sprites/Buggy'
import { Firepit } from '../sprites/Firepit'
import { Antenna } from '../sprites/Antenna'
import { Boxes } from '../sprites/Boxes'
import { MetalBox } from '../sprites/MetalBox'
import { Bucket } from '../sprites/Bucket'
import { Ladder } from '../sprites/Ladder'
import { cameraFade, cameraPan, timer } from '../utils/promisify'
import { BaseScene } from './BaseScene'
import { randomLine } from '../default-lines'
import { CraftBench } from '../sprites/CraftBench'

class BaseBuildingScene extends BaseScene {
  public use: any = {
    ...this.use,
    survivorBox: {
      setText: null,
      name: 'Survivor',
      use: () => {
        // copied from base scene. should unify somewhere
        this.interactingWithObject = true
        if (this.currentObject.consumable) {
          document.dispatchEvent(
            new CustomEvent('consume', {
              detail: { id: this.currentObject.id },
            })
          )
          return this.createDialog('Ah… much better')
        }

        if (this.currentObject.id === 'taser') {
          return this.createDialog('NO WAY!!')
        }

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
    ladder: {
      setText: null,
      name: 'Ladder',
      use: () => {
        this.interactingWithObject = true
        return this.createDialog(randomLine())
      },
    },
    bucket: {
      setText: null,
      name: 'Bucket',
      use: () => {
        this.interactingWithObject = true
        return this.createDialog(randomLine())
      },
    },
    wall: {
      setText: null,
      name: 'Wall',
      use: () => {
        this.interactingWithObject = true
        return this.createDialog(randomLine())
      },
    },
    pit: {
      setText: null,
      name: 'Fire pit',
      use: () => {
        this.interactingWithObject = true
        // if (this.currentObject.id === 'wood') {
        //   return this.addWood()
        // }
        // if (this.currentObject.id === 'brokenGlass') {
        //   return this.setUpFire()
        // }
        // if (this.currentObject.id === 'pinecone') {
        //   return this.createDialog(
        //     "It would burn too fast. Besides, I could really use the pine nuts, I'm low on food!"
        //   )
        // }
        return this.createDialog(randomLine())
      },
    },
    rock: {
      setText: null,
      name: 'Rock',
      use: () => {
        this.interactingWithObject = true
        // if (this.currentObject.id === 'pinecone') {
        //   return this.getNuts()
        // }
        return this.createDialog(randomLine())
      },
    },
  }

  public interact: any = {
    buggy: {
      key: 'interactBuggy',
      text: 'Look at buggy',
      cb: this.interactBuggy,
    },
    bucket: {
      key: 'interactBucket',
      text: 'Pick up bucket',
      cb: this.interactBucket,
    },
    ladder: {
      key: 'interactLadder',
      text: 'Use ladder',
      cb: this.interactLadder,
      permanent: true,
    },
    rock: {
      key: 'interactRock',
      text: 'Pick up rock',
      cb: this.interactRock,
    },
    wall: {
      key: 'interactWall',
      text: 'Look at wall',
      cb: this.interactWall,
    },
    pit: {
      key: 'interactPit',
      text: 'Look at pit',
      cb: this.interactPit,
    },
    antennas: {
      key: 'interactAntennas',
      text: 'Look at antennas',
      cb: this.interactAntennas,
    },
    metalBox: {
      key: 'interactBox',
      text: 'Look at box',
      cb: this.interactBox,
    },
    craftbench: {
      key: 'interactBench',
      text: 'Use bench',
      cb: this.interactBench,
    },
  }

  public interactKeys = [
    'bucket',
    'ladder',
    'wall',
    'pit',
    'antennas',
    'buggy',
    'rock',
    'metalBox',
    'craftbench',
  ]

  public WORLD = {
    WIDTH: 1280,
    HEIGHT: 800,
  }
  public survivor: Survivor
  public buggy: Buggy
  public ladder: Ladder
  public bucket: Bucket
  public boxes: Boxes
  public metalBox: MetalBox
  public pit: Firepit
  public craftbench: CraftBench
  public nightBackground: Phaser.GameObjects.Image
  public nightForeground: Phaser.GameObjects.Image
  public trees: Phaser.GameObjects.TileSprite
  public hills: Phaser.GameObjects.TileSprite
  public grassForeground: Phaser.GameObjects.TileSprite
  public upstairsFloor: Physics.Arcade.Sprite
  public floor: Physics.Arcade.Sprite
  public platforms: Physics.Arcade.StaticGroup
  public antennasSprites: Physics.Arcade.Group
  public dropAnimation: Phaser.Tweens.Tween
  public forest: Phaser.GameObjects.Image
  public wood: Physics.Arcade.Image
  public wall: Physics.Arcade.Image
  public antennas: Physics.Arcade.Image
  public rock: Physics.Arcade.Image
  public drop: Phaser.GameObjects.Image
  public nightAudio: Phaser.Sound.BaseSound
  public bgAudio: Phaser.Sound.BaseSound
  public dropAudio: Phaser.Sound.BaseSound
  public isUpstairs = false
  public isWaterCollectorFull = true
  public ladderXPosition = 1130
  public ladderCutscene = false
  public timeout: number

  // constructor() {
  //   super({
  //     key: 'BUILDING_BASE',
  //   })
  // }

  public preload() {
    // Load common assets
    this.commonPreload()

    // Preload audio
    this.loadAudio(AUDIO.BIRDS)
    this.loadAudio(AUDIO.CRICKETS)
    this.loadAudio(AUDIO.DROP)

    // Preload images
    this.loadImage(IMAGES.BUILDING_BG)
    this.loadImage(IMAGES.BUILDING_BG_2)
    this.loadImage(IMAGES.BUILDING_NIGHT_BG)
    this.loadImage(IMAGES.BUILDING_NIGHT_BG_2)
    this.loadImage(IMAGES.BUILDING_HILLS)
    this.loadImage(IMAGES.BUILDING_FOREST)
    this.loadImage(IMAGES.FLOOR)
    this.loadImage(IMAGES.DROP)
    this.loadImage(IMAGES.ROCK)

    // Preload sprites
    this.loadSprite(SPRITES.METALBOX)
    this.loadSprite(SPRITES.LADDER)
    this.loadSprite(SPRITES.BUCKET)
    this.loadSprite(SPRITES.BOXES)
    this.loadSprite(SPRITES.ANTENNA)
    this.loadSprite(SPRITES.FIREPIT)
    this.loadSprite(SPRITES.BUGGY)
    this.loadSprite(SPRITES.CRAFTBENCH)
  }

  public async create() {
    this.createSprites()

    this.setInteractions()

    this.cameras.main.setBounds(0, 0, this.WORLD.WIDTH, this.WORLD.HEIGHT)
    cameraFade(this, 'fadeIn')

    await timer(this, 700)
    await cameraPan(this, this.survivor.x, this.survivor.y, 4000)
    this.cameras.main.startFollow(this.survivor)
    this.initCutscene()
  }

  public update() {
    this.grassForeground.tilePositionX = this.cameras.main.scrollX * 1.2
    this.physics.world.gravity.y = 800
    this.survivor.update()
  }

  public createSprites() {
    this.bgAudio = this.sound.add(AUDIO.BIRDS.KEY)

    this.bgAudio.play('', {
      loop: true,
    })

    this.initScene()

    this.dropAudio = this.sound.add(AUDIO.DROP.KEY)
    this.nightAudio = this.sound.add(AUDIO.CRICKETS.KEY)

    const bg = this.add.image(0, 0, IMAGES.BUILDING_BG.KEY).setOrigin(0)
    this.nightBackground = this.add
      .image(0, 0, IMAGES.BUILDING_NIGHT_BG.KEY)
      .setOrigin(0)
      .setAlpha(0, 0, 0, 0)

    this.createClouds(200, 1)

    this.antennasSprites = this.physics.add.group({
      immovable: true,
      allowGravity: false,
    })

    this.antennasSprites.addMultiple([
      new Antenna({
        scene: this,
        x: 145,
        y: 265,
      }),
      new Antenna({
        scene: this,
        x: 10,
        y: 335,
      }),
      new Antenna({
        scene: this,
        x: 10,
        y: 335,
      })
        .setTintFill(0x9fb9b4)
        .setAlpha(0.3),
      new Antenna({
        scene: this,
        x: 280,
        y: 323,
      }),
      new Antenna({
        scene: this,
        x: 280,
        y: 323,
      })
        .setTintFill(0x9fb9b4)
        .setAlpha(0.5),
    ])

    this.antennasSprites.playAnimation('antennaBlink')

    this.forest = this.add
      .image(0, 0, IMAGES.BUILDING_FOREST.KEY)
      .setOrigin(0, 0)
      .setScrollFactor(0.95, 0.98)

    this.trees = this.add
      .tileSprite(300, 75, 820, 720, IMAGES.TREES.KEY)
      .setOrigin(0, 0)
      .setScrollFactor(0.9, 0.94)

    this.hills = this.add
      .tileSprite(0, -10, 820, 720, IMAGES.BUILDING_HILLS.KEY)
      .setOrigin(0, 0)
      .setScrollFactor(0.85, 0.9)

    this.add.image(0, 0, IMAGES.BUILDING_BG_2.KEY).setOrigin(0)
    this.nightForeground = this.add
      .image(0, 0, IMAGES.BUILDING_NIGHT_BG_2.KEY)
      .setOrigin(0)
      .setAlpha(0, 0, 0, 0)

    this.physics.world.setBounds(0, 0, this.WORLD.WIDTH, this.WORLD.HEIGHT)

    this.platforms = this.physics.add.staticGroup()

    const floor = this.platforms
      .create(0, 684, IMAGES.FLOOR.KEY, null, false)
      .setOrigin(0)
    floor.scaleX = bg.width / 30
    floor.refreshBody()

    this.platforms.create(680, 365, IMAGES.FLOOR.KEY, null, false)
    this.platforms.create(1278, 365, IMAGES.FLOOR.KEY, null, false)
    this.platforms.create(740, 425, IMAGES.FLOOR.KEY, null, false)

    this.upstairsFloor = this.platforms
      .create(710, 395, IMAGES.FLOOR.KEY, null, false)
      .setOrigin(0)
    this.upstairsFloor.scaleX = 9
    this.upstairsFloor.refreshBody()

    this.upstairsFloor.body.checkCollision.down = false

    this.ladder = new Ladder({
      scene: this,
      x: this.ladderXPosition,
      y: 532,
    })
    this.physics.add.collider(this.platforms, this.ladder)
    this.ladder.setInteractive()
    this.ladder.play('ladderDay')

    this.metalBox = new MetalBox({ scene: this, x: 1030, y: 660 })
    this.physics.add.collider(this.platforms, this.metalBox)
    this.metalBox.play('metalBoxDay')
    this.metalBox.setInteractive()

    this.rock = this.physics.add
      .staticImage(415, 624, IMAGES.ROCK.KEY)
      .refreshBody()
      .setInteractive()

    this.pit = new Firepit({
      scene: this,
      x: 880,
      y: 653,
    })
    this.physics.add.collider(this.platforms, this.pit)
    this.pit.play('default')
    this.pit.setInteractive()

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

    this.craftbench = new CraftBench({
      scene: this,
      x: 771,
      y: 630,
    })

    this.physics.add.collider(this.platforms, this.craftbench)
    this.craftbench.play('craftbenchDay')
    this.craftbench.setInteractive()

    this.initSurvivor()

    this.boxes = new Boxes({
      scene: this,
      x: 771,
      y: 322,
    })
    this.boxes.setDepth(1)
    this.boxes.play('boxesDay')

    this.drop = this.add.image(600, 428, IMAGES.DROP.KEY).setOrigin(0)

    this.dropAnimation = this.tweens.add({
      targets: this.drop,
      y: '+=250',
      ease: 'Linear',
      duration: 600,
      repeatDelay: 2000,
      repeat: -1, // infinity
      yoyo: false,
      onRepeat: () => {
        this.dropAudio.play({
          volume: 0.5,
        })
      },
    })

    this.buggy = new Buggy({
      scene: this,
      x: 100,
      y: 600,
    })
    this.buggy.play('buggy-parked')
    this.physics.add.collider(this.platforms, this.buggy)
    this.buggy.setInteractive()

    this.grassForeground = this.add
      .tileSprite(0, 755, 820, 96, IMAGES.GRASS_FOREGROUND.KEY)
      .setOrigin(0, 0)
      .setScrollFactor(0, 1)
  }

  public initCutscene() {
    this.startGame()
  }

  public initSurvivor() {
    this.survivor = new Survivor({
      scene: this,
      x: 950,
      y: 625,
    })

    this.physics.add.collider(
      this.platforms,
      this.survivor,
      (survivor: Survivor, platform: Physics.Arcade.Sprite) => {
        if (platform.y > 600 && this.isUpstairs) {
          this.survivor.play('stand')
          this.isUpstairs = false
          this.ladderCutscene = false
          this.sys.events.off(
            this.interact.ladder.key,
            this.interact.ladder.cb,
            this,
            false
          )
        } else if (survivor.body.y < 350 && !this.isUpstairs) {
          this.survivor.play('stand')
          this.isUpstairs = true
          this.ladderCutscene = false
          this.sys.events.off(
            this.interact.ladder.key,
            this.interact.ladder.cb,
            this,
            false
          )
        }
      }
    )

    this.setupInput()
  }

  public interactLadder() {
    this.finishInteraction()
    if (!this.ladderCutscene) {
      this.ladderCutscene = true
      this.survivor.setDestination(this.ladderXPosition)
    }
    if (
      this.ladderCutscene &&
      !this.playingCutscene &&
      this.survivor.x > this.ladderXPosition - 5 &&
      this.survivor.x < this.ladderXPosition + 5
    ) {
      if (this.survivor.body.velocity.x !== 0) {
        this.survivor.stop()
      }
      if (
        !this.survivor.anims.currentAnim ||
        this.survivor.anims.currentAnim.key !== 'climbing'
      ) {
        this.survivor.play('climbing')
      }
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

  public interactBucket() {
    console.error('interactBucket should be implemented')
  }

  public interactWall() {
    this.finishInteraction()
    this.createDialog(
      'Someone has written the name "Libby" all over the wall... Geez, what a creep.'
    )
  }

  public interactPit() {
    this.finishInteraction()
    this.createDialog("I'll need some more wood for tonight.")
  }

  public async interactAntennas() {
    this.finishInteraction()
    this.startCutscene()
    this.cameras.main.stopFollow()
    await cameraPan(this, 0, 0, 1000)
    await this.createDialog(
      'Hmm, looks like they are active. I wonder what they are for.'
    )
    await cameraPan(this, this.survivor.x, this.survivor.y, 1000)
    this.cameras.main.startFollow(this.survivor)
    this.stopCutscene()
  }

  public interactBuggy() {
    this.finishInteraction()
    this.createDialog('Not much more I can do to fix it today.')
  }

  public interactRock() {
    this.finishInteraction()
    this.createDialog("I don't want to carry a rock around.")
  }

  public async interactBox() {
    if (!this.playingCutscene) {
      this.survivor.stop()
      this.finishInteraction()
      return this.createDialog("It's empty.")
    }
  }

  public interactBench() {
    this.survivor.stop()
    this.finishInteraction()
    document.dispatchEvent(new CustomEvent('startCrafting'))
    // return this.createDialog('I can craft stuff here.')
  }

  public setNightMode() {
    this.bgAudio.stop()
    this.nightAudio.play('', { loop: true })

    Phaser.Actions.Call(
      this.clouds.getChildren(),
      (cloud: Phaser.GameObjects.Sprite) => {
        this.clouds.killAndHide(cloud)
      },
      this
    )
    this.forest.destroy()
    this.trees.destroy()
    this.hills.destroy()
    this.buggy.destroy()
    this.rock.destroy()
    this.grassForeground.destroy()
    this.nightBackground.setAlpha(1, 1, 1, 1)
    this.nightForeground.setAlpha(1, 1, 1, 1)
    this.antennasSprites.playAnimation('antennaNightBlink')
    const antennas = this.antennasSprites.getChildren() as Antenna[]
    antennas[2].setTintFill(0x222034)
    antennas[4].setTintFill(0x222034)
    this.metalBox.play('metalBoxNight')
    this.boxes.play('boxesNight')
    this.bucket.play('bucketNight')
    this.ladder.play('ladderNight')
    this.craftbench.play('craftbenchNight')
  }
}

export default BaseBuildingScene
