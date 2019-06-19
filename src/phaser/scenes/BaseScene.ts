import { DialogService } from '../utils/dialog'

export class BaseScene extends Phaser.Scene {
  public playingCutscene = true
  public dialog: DialogService
  public useText: Phaser.GameObjects.Text
  public currentObject: {id: string, name: string, consumable: boolean} = null
  public interactingWithObject = false

  public initScene() {
    this.addListeners()
    this.dialog = new DialogService(this)
  }

  public activateHovers(currentObject) {
    throw new Error('Class should implement activateHovers method')
  }

  public startCutscene() {
    this.playingCutscene = true
    document.dispatchEvent(new Event('playCutscene'))
  }

  public stopCutscene() {
    this.playingCutscene = false
    document.dispatchEvent(new Event('stopCutscene'))
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
    this.useText = this.add.text(100, 500, `Use ${ev.detail.name} with`)
    this.activateHovers(ev.detail)
  }
}
