import { DialogService } from '../utils/dialog'

export class BaseScene extends Phaser.Scene {
  public playingCutscene = true
  public dialog: DialogService
  public useText: Phaser.GameObjects.Text
  public currentObjectId: string = null
  public interactingWithObject = false

  public initScene() {
    this.addListeners()
    this.dialog = new DialogService(this)
  }

  public activateHovers(currentObjectId) {
    throw new Error('Class should implement activateHovers method')
  }

  private addListeners() {
    document.addEventListener('gameOver', this.handleGameOver.bind(this))
    document.addEventListener('useItem', this.handleUseItem.bind(this))
  }

  private handleGameOver() {
    this.playingCutscene = true
    this.add.text(100, 100, 'Game over')
  }

  private handleUseItem(ev: CustomEvent) {
    this.useText = this.add.text(100, 500, `Use ${ev.detail.name} with`)
    this.activateHovers(ev.detail.id)
  }
}
