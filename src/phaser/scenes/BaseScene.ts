import { DialogService } from '../utils/dialog'

export class BaseScene extends Phaser.Scene {
  public playingCutscene = true
  public dialog: DialogService

  public listenForGameOver() {
    document.addEventListener('gameOver', () => {
      this.playingCutscene = true
      this.add.text(100, 100, 'Game over')
    })
  }
}
