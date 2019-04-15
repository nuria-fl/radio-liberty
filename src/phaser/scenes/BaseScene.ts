import { DialogService } from '../utils/dialog'

export class BaseScene extends Phaser.Scene {
  public playingCutscene = true
  public dialog: DialogService
}
