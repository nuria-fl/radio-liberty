import Phaser from 'phaser'

export class DialogService {
  public scene: Phaser.Scene
  public timedEvent: Phaser.Time.TimerEvent
  public text: Phaser.GameObjects.Text
  public graphics: Phaser.GameObjects.Graphics
  public config = {
    borderAlpha: 1,
    borderColor: 0x101010,
    borderThickness: 3,
    windowAlpha: 0.8,
    windowColor: 0x303030,
    windowHeight: 100,
    padding: 15,
    dialogSpeed: 30
  }
  public eventCounter: number
  public dialog: string[]
  public animating = false

  constructor(scene) {
    this.scene = scene
  }

  // Initialize the dialog modal
  public init(opts: any = {}) {
    // set properties from opts object or use defaults
    Object.assign(this.config, opts)

    // used for animating the text
    this.eventCounter = 0

    // Create the dialog window
    this.createWindow()
  }

  public closeDialog() {
    this.graphics.destroy()
    this.text.destroy()
  }

  // Sets the text for the dialog window
  public setText(text: string) {
    // Reset the dialog
    this.eventCounter = 0
    this.dialog = text.split('')
    if (this.timedEvent) {
      this.timedEvent.remove()
    }

    this.setDialogText('')

    this.animating = true
    this.timedEvent = this.scene.time.addEvent({
      delay: this.config.dialogSpeed,
      callback: this.animateText,
      callbackScope: this,
      loop: true
    })
  }

  // Gets the width of the game (based on the scene)
  private getGameWidth() {
    return Number(this.scene.sys.game.config.width)
  }

  // Gets the height of the game (based on the scene)
  private getGameHeight() {
    return Number(this.scene.sys.game.config.height)
  }

  // Calculates where to place the dialog window based on the game size
  private calculateWindowDimensions(width, height) {
    const x = this.config.padding
    const y = height - this.config.windowHeight - this.config.padding
    const rectWidth = width - this.config.padding * 2
    const rectHeight = this.config.windowHeight
    return {
      x,
      y,
      rectWidth,
      rectHeight
    }
  }
  // Creates the inner dialog window (where the text is displayed)
  private createInnerWindow(x, y, rectWidth, rectHeight) {
    this.graphics.fillStyle(this.config.windowColor, this.config.windowAlpha)
    this.graphics.fillRect(x + 1, y + 1, rectWidth - 1, rectHeight - 1)
  }

  // Creates the border rectangle of the dialog window
  private createOuterWindow(x, y, rectWidth, rectHeight) {
    this.graphics.lineStyle(
      this.config.borderThickness,
      this.config.borderColor,
      this.config.borderAlpha
    )
    this.graphics.strokeRect(x, y, rectWidth, rectHeight)
  }

  private createWindow() {
    const gameHeight = this.getGameHeight()
    const gameWidth = this.getGameWidth()
    const dimensions = this.calculateWindowDimensions(gameWidth, gameHeight)
    this.graphics = this.scene.add.graphics()
    this.graphics.setScrollFactor(0, 0)

    this.createOuterWindow(
      dimensions.x,
      dimensions.y,
      dimensions.rectWidth,
      dimensions.rectHeight
    )
    this.createInnerWindow(
      dimensions.x,
      dimensions.y,
      dimensions.rectWidth,
      dimensions.rectHeight
    )
  }

  private animateText() {
    this.eventCounter++
    this.text.setText(this.text.text + this.dialog[this.eventCounter - 1])
    if (this.eventCounter === this.dialog.length) {
      this.timedEvent.remove()
      this.animating = false
    }
  }

  // Calcuate the position of the text in the dialog window
  private setDialogText(text) {
    // Reset the dialog
    if (this.text) {
      this.text.destroy()
    }

    const dimensions = this.calculateWindowDimensions(
      this.getGameWidth(),
      this.getGameHeight()
    )

    const x = dimensions.x + this.config.padding
    const y = dimensions.y + this.config.padding

    this.text = this.scene.make.text({
      x,
      y,
      text,
      style: {
        wordWrap: { width: this.getGameWidth() - this.config.padding * 2 - 25 }
      }
    })
    this.text.setScrollFactor(0, 0)
  }
}

export const createDialogBox = (
  text: string,
  stopCutscene = true,
  scene: any
) => {
  return new Promise(resolve => {
    if (scene.survivor) {
      scene.survivor.stop()
    }
    scene.startCutscene()
    scene.dialog.init()
    scene.dialog.setText(text)
    const addListener = () => {
      scene.input.once('pointerup', () => {
        if (!scene.dialog.animating) {
          scene.dialog.closeDialog()
          if (stopCutscene) {
            scene.stopCutscene()
          }
          resolve()
        } else {
          addListener()
        }
      })
    }
    addListener()
  })
}
