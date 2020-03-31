import { DialogService, createDialogBox } from '../utils/dialog'
import Survivor from '../sprites/Survivor'
import { randomLine } from '../default-lines'

export class BaseScene extends Phaser.Scene {
  public survivor: Survivor
  public playingCutscene = true
  public dialog: DialogService
  public useText: Phaser.GameObjects.Text
  public interactText: Phaser.GameObjects.Text
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
              detail: { id: this.currentObject.id }
            })
          )
          return this.createDialog('Ah… much better')
        }

        if (this.currentObject.id === 'taser') {
          return this.createDialog('NO WAY!!')
        }
        return this.createDialog(randomLine())
      }
    }
  }
  public interact = {}

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
        detail: { id: object.id }
      })
    )
  }

  public createDialog(text, stopCutscene = true) {
    return createDialogBox(text, stopCutscene, this)
  }

  public setInteractions(keys: string[]) {
    keys.forEach(key => this.setupEvent(key))
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

    Object.keys(this.use).forEach(key => {
      this.use[key].setText = () => {
        setText(`${baseText} ${this.use[key].name}`)
      }

      this[key].on('pointerover', this.use[key].setText)
      this[key].on('pointerdown', this.use[key].use)
      this[key].on('pointerout', reset)
    })

    this.input.on('pointerdown', () => {
      Object.keys(this.use).forEach(key => {
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
