import { DialogService, createDialogBox } from '../utils/dialog'
import Survivor from '../sprites/Survivor'
import { randomLine } from '../default-lines'

export class BaseScene extends Phaser.Scene {
  public survivor: Survivor
  public playingCutscene = true
  public dialog: DialogService
  public useText: Phaser.GameObjects.Text
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

  public createDialog(text, cb = null) {
    createDialogBox(text, cb, this)
  }

  private addListeners() {
    document.addEventListener('gameOver', this.handleGameOver.bind(this))
    document.addEventListener('useItem', this.handleUseItem.bind(this))
  }

  private handleGameOver() {
    this.startCutscene()
    this.add.text(100, 100, 'Game over')
  }

  private handleUseItem(ev: CustomEvent) {
    this.useText = this.add.text(
      this.cameras.main.worldView.x + 10,
      this.cameras.main.worldView.y + 500,
      `Use ${ev.detail.name} with`
    )
    this.activateHovers(ev.detail)
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
