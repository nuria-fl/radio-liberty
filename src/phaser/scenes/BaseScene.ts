import { DialogService, createDialogBox } from '../utils/dialog'
import { Survivor } from '../sprites/Survivor'
import { randomLine } from '../default-lines'
import { SPRITES, AUDIO } from '../constants'

interface Asset {
  KEY: string
  FILE: string
}

interface SpriteAsset {
  KEY: string
  FILE: string
  WIDTH: number
  HEIGHT: number
}

export class BaseScene extends Phaser.Scene {
  public WORLD = {
    WIDTH: 830,
    HEIGHT: 520,
  }
  public survivor: Survivor
  public playingCutscene = true
  public dialog: DialogService
  public useText: Phaser.GameObjects.Text
  public interactText: Phaser.GameObjects.Text
  public clouds: Phaser.GameObjects.Group
  public currentObject: { id: string; name: string; consumable: boolean } = null
  public interactingWithObject = false
  public use = {
    survivor: {
      setText: null,
      name: 'Survivor',
      use: () => {
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
  }
  public interact = {}

  public loadImage(IMAGE: Asset) {
    this.load.image(IMAGE.KEY, `/images/${IMAGE.FILE}`)
  }

  public loadAudio(AUDIO: Asset) {
    this.load.audio(AUDIO.KEY, `/sound/${AUDIO.FILE}`)
  }

  public loadSprite(SPRITE: SpriteAsset) {
    this.load.spritesheet(SPRITE.KEY, `/images/${SPRITE.FILE}`, {
      frameWidth: SPRITE.WIDTH,
      frameHeight: SPRITE.HEIGHT,
    })
  }

  public commonPreload() {
    this.loadSprite(SPRITES.CLOUDS)
    this.loadSprite(SPRITES.SURVIVOR)
    this.loadAudio(AUDIO.WALK)
  }

  public initScene() {
    this.addListeners()
    this.dialog = new DialogService(this)
  }

  public startCutscene() {
    this.playingCutscene = true
    document.dispatchEvent(new Event('playCutscene'))
  }

  public stopCutscene() {
    this.playingCutscene = false
    document.dispatchEvent(new Event('stopCutscene'))
  }

  public pickUp(item) {
    document.dispatchEvent(new CustomEvent('pickUp', { detail: item }))
  }

  public removeItem(object) {
    document.dispatchEvent(
      new CustomEvent('removeItem', {
        detail: { id: object.id },
      })
    )
  }

  public createDialog(text, stopCutscene = true) {
    return createDialogBox(text, stopCutscene, this)
  }

  public setupInput() {
    this.input.on('pointerdown', (pointer) => {
      if (this.playingCutscene === false && !this.survivor.isDown) {
        // remove all interactions
        Object.keys(this.interact).forEach((k) => {
          this.sys.events.off(
            this.interact[k].key,
            this.interact[k].cb,
            this,
            false
          )
        })

        this.survivor.setDestination(pointer.worldX)
        this.physics.moveTo(this.survivor, pointer.worldX, this.survivor.y, 100)
      }
    })
  }

  public setInteractions(keys: string[]) {
    keys.forEach((key) => this.setupEvent(key))
    this.interactText = this.add.text(10, 500, '')
    this.interactText.setScrollFactor(0, 0)
  }

  public setupEvent(key: string) {
    this[key].on('pointerup', () => {
      if (!this.playingCutscene) {
        this.interactText.setText('')
        this.sys.events.on(this.interact[key].key, this.interact[key].cb, this)
      }
    })
    this[key].on('pointerover', () => {
      if (!this.playingCutscene) {
        this.interactText.setText(this.interact[key].text)
      }
    })
    this[key].on('pointerout', () => {
      this.interactText.setText('')
    })
    this.physics.add.overlap(this.survivor, this[key], () => {
      this.sys.events.emit(this.interact[key].key)
      if (!this.interact[key].permanent) {
        this.offEvent(key)
      }
    })
  }

  public startGame() {
    document.dispatchEvent(new CustomEvent('startGame'))
  }

  public endGame() {
    document.dispatchEvent(new CustomEvent('endGame'))
  }

  public createClouds(verticalOffset = 120, scrollFactor = 0) {
    this.clouds = this.add.group({
      defaultKey: SPRITES.CLOUDS.KEY,
      defaultFrame: 0,
    })

    this.clouds
      .create(550, 150 + verticalOffset, SPRITES.CLOUDS.KEY, 0)
      .setScrollFactor(scrollFactor, 1)
    this.clouds
      .create(300, 40 + verticalOffset, SPRITES.CLOUDS.KEY, 1)
      .setScrollFactor(scrollFactor, 1)
    this.clouds
      .create(-200, 110 + verticalOffset, SPRITES.CLOUDS.KEY, 2)
      .setScrollFactor(scrollFactor, 1)
    this.clouds
      .create(-400, 70 + verticalOffset, SPRITES.CLOUDS.KEY, 1)
      .setScrollFactor(scrollFactor, 1)

    let i = 1
    Phaser.Actions.Call(
      this.clouds.getChildren(),
      function (cloud: Phaser.GameObjects.Sprite) {
        const timeline = this.tweens.createTimeline()
        timeline.add({
          targets: cloud,
          x: scrollFactor ? this.WORLD.WIDTH + 50 : 950,
          duration: 45000 + 10000 * (i - 0.5),
          yoyo: false,
          repeat: 0,
        })
        timeline.add({
          targets: cloud,
          x: {
            from: -100 * (i + 0.5),
            to: (scrollFactor ? this.WORLD.WIDTH : 900) + 100 * i,
          },
          duration: 65000 + 20000 * Math.random(),
          yoyo: false,
          loop: -1,
        })
        timeline.play()
        i++
      },
      this
    )
  }

  private offEvent(key: string) {
    this.sys.events.off(
      this.interact[key].key,
      this.interact[key].cb,
      this,
      false
    )
  }

  private addListeners() {
    document.addEventListener('pauseScene', this.pauseScene.bind(this))
    document.addEventListener('resumeScene', this.resumeScene.bind(this))
    document.addEventListener('gameOver', this.handleGameOver.bind(this))
    document.addEventListener('useItem', this.handleUseItem.bind(this))
    document.addEventListener('inspectItem', this.handleInspectItem.bind(this))
  }

  private pauseScene() {
    this.scene.pause()
    this.sound.pauseAll()
  }

  private resumeScene() {
    this.scene.resume()
    this.sound.resumeAll()
  }

  private handleGameOver() {
    this.startCutscene()
    this.survivor.die()
  }

  private handleUseItem(ev: CustomEvent) {
    this.useText = this.add.text(10, 500, `Use ${ev.detail.name} with`)
    this.useText.setScrollFactor(0, 0)
    this.activateHovers(ev.detail)
  }

  private handleInspectItem(ev: CustomEvent) {
    this.createDialog(ev.detail.description)
  }

  private activateHovers(currentObject) {
    this.currentObject = currentObject
    this.interactingWithObject = false

    this.startCutscene()

    const baseText = this.useText.text

    this.survivor.setInteractive()

    const setText = (text: string) => {
      if (this.useText.active) {
        this.useText.setText(text)
      }
    }

    const reset = () => setText(baseText)

    Object.keys(this.use).forEach((key) => {
      this.use[key].setText = () => {
        setText(`${baseText} ${this.use[key].name}`)
      }

      this[key].on('pointerover', this.use[key].setText)
      this[key].on('pointerdown', this.use[key].use)
      this[key].on('pointerout', reset)
    })

    this.input.on('pointerdown', () => {
      Object.keys(this.use).forEach((key) => {
        this[key].off('pointerover', this.use[key].setText)
        this[key].off('pointerdown', this.use[key].use)
        this[key].off('pointerout', reset)
        this.use[key].setText = null
      })
      if (!this.interactingWithObject) {
        this.stopCutscene()
      }

      this.survivor.removeInteractive()
      this.useText.destroy()
      this.currentObject = null
    })
  }
}
