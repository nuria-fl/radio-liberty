import Phaser from 'phaser'

class DialogService {
  scene: Phaser.Scene
  timedEvent
  text
  config = {
    borderAlpha: 1,
    borderColor: 0x101010,
    borderThickness: 3,
    windowAlpha: 0.8,
    windowColor: 0x303030,
    windowHeight: 100,
    padding: 15,
    dialogSpeed: 4
  }
  eventCounter
  visible
  dialog
  graphics
  animating = false

  constructor(scene) {
    this.scene = scene
  }

  // Initialize the dialog modal
  init(opts: any = {}) {
    // set properties from opts object or use defaults
    Object.assign(this.config, opts)

    // used for animating the text
    this.eventCounter = 0
    // if the dialog window is shown
    this.visible = true

    // Create the dialog window
    this.createWindow()
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
    var x = this.config.padding
    var y = height - this.config.windowHeight - this.config.padding
    var rectWidth = width - this.config.padding * 2
    var rectHeight = this.config.windowHeight
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
    var gameHeight = this.getGameHeight()
    var gameWidth = this.getGameWidth()
    var dimensions = this.calculateWindowDimensions(gameWidth, gameHeight)
    this.graphics = this.scene.add.graphics()

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

  toggleWindow() {
    this.visible = !this.visible
    if (this.text) this.text.visible = this.visible
    if (this.graphics) this.graphics.visible = this.visible
  }

  // Sets the text for the dialog window
  setText(text) {
    // Reset the dialog
    this.eventCounter = 0
    this.dialog = text.split('')
    if (this.timedEvent) this.timedEvent.remove()

    this.setDialogText('')

    this.animating = true
    this.timedEvent = this.scene.time.addEvent({
      delay: 150 - this.config.dialogSpeed * 30,
      callback: this.animateText,
      callbackScope: this,
      loop: true
    })
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
    if (this.text) this.text.destroy()

    var x = this.config.padding + 10
    var y =
      this.getGameHeight() - this.config.windowHeight - this.config.padding + 10

    this.text = this.scene.make.text({
      x,
      y,
      text,
      style: {
        wordWrap: { width: this.getGameWidth() - this.config.padding * 2 - 25 }
      }
    })
  }
}
export default DialogService
