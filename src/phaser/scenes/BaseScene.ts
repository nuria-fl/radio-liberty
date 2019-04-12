import { DialogService } from '../utils/dialog'

export class BaseScene extends Phaser.Scene {
  playingCutscene = true
  dialog: DialogService
}
