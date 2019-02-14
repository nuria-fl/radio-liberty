import Phaser from 'phaser'

class DialogService {
  scene: Phaser.Scene
  timedEvent
  text
  borderAlpha
  borderColor
  borderThickness
  windowAlpha
  windowColor
  windowHeight
  padding
  closeBtnColor
  dialogSpeed
  eventCounter
  visible
  dialog
  graphics
  closeBtn

  constructor(scene) {
    this.scene = scene
  }

  // Initialize the dialog modal
  init(opts: any = {}) {
    if (!opts) opts = {}
    // set properties from opts object or use defaults
    this.borderThickness = opts.borderThickness || 3
    this.borderColor = opts.borderColor || 0x101010
    this.borderAlpha = opts.borderAlpha || 1
    this.windowAlpha = opts.windowAlpha || 0.8
    this.windowColor = opts.windowColor || 0x303030
    this.windowHeight = opts.windowHeight || 100
    this.padding = opts.padding || 15
    this.closeBtnColor = opts.closeBtnColor || 'darkgoldenrod'
    this.dialogSpeed = opts.dialogSpeed || 3

    // used for animating the text
    this.eventCounter = 0
    // if the dialog window is shown
    this.visible = true
    // the current text in the window
    this.text
    // the text that will be displayed in the window
    this.dialog
    this.graphics
    this.closeBtn

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
    var x = this.padding
    var y = height - this.windowHeight - this.padding
    var rectWidth = width - this.padding * 2
    var rectHeight = this.windowHeight
    return {
      x,
      y,
      rectWidth,
      rectHeight
    }
  }
  // Creates the inner dialog window (where the text is displayed)
  private createInnerWindow(x, y, rectWidth, rectHeight) {
    this.graphics.fillStyle(this.windowColor, this.windowAlpha)
    this.graphics.fillRect(x + 1, y + 1, rectWidth - 1, rectHeight - 1)
  }

  // Creates the border rectangle of the dialog window
  private createOuterWindow(x, y, rectWidth, rectHeight) {
    this.graphics.lineStyle(
      this.borderThickness,
      this.borderColor,
      this.borderAlpha
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
    // this.createCloseModalButton()
    // this.createCloseModalButtonBorder()
  }

  private createCloseModalButton() {
    var self = this
    this.closeBtn = this.scene.make.text({
      x: this.getGameWidth() - this.padding - 14,
      y: this.getGameHeight() - this.windowHeight - this.padding + 3,
      text: '×',
      style: {
        font: 'bold 12px Arial',
        fill: this.closeBtnColor
      }
    })
    this.closeBtn.setInteractive()

    this.closeBtn.on('pointerover', function() {
      this.setTint(0xff0000)
    })
    this.closeBtn.on('pointerout', function() {
      this.clearTint()
    })
    this.closeBtn.on('pointerdown', function() {
      self.toggleWindow()
    })

    if (this.timedEvent) this.timedEvent.remove()
    if (this.text) this.text.destroy()
  }

  private createCloseModalButtonBorder() {
    var x = this.getGameWidth() - this.padding - 20
    var y = this.getGameHeight() - this.windowHeight - this.padding
    this.graphics.strokeRect(x, y, 20, 20)
  }

  toggleWindow() {
    this.visible = !this.visible
    if (this.text) this.text.visible = this.visible
    if (this.graphics) this.graphics.visible = this.visible
    if (this.closeBtn) this.closeBtn.visible = this.visible
  }

  // Sets the text for the dialog window
  setText(text, animate) {
    // Reset the dialog
    this.eventCounter = 0
    this.dialog = text.split('')
    if (this.timedEvent) this.timedEvent.remove()

    var tempText = animate ? '' : text
    this.setDialogText(tempText)

    if (animate) {
      this.timedEvent = this.scene.time.addEvent({
        delay: 150 - this.dialogSpeed * 30,
        callback: this.animateText,
        callbackScope: this,
        loop: true
      })
    }
  }

  private animateText() {
    this.eventCounter++
    this.text.setText(this.text.text + this.dialog[this.eventCounter - 1])
    if (this.eventCounter === this.dialog.length) {
      this.timedEvent.remove()
      console.log('here')

      // this.graphics.on('pointerdown', function() {
      //   this.toggleWindow()
      // })
    }
  }

  // Calcuate the position of the text in the dialog window
  private setDialogText(text) {
    // Reset the dialog
    if (this.text) this.text.destroy()

    var x = this.padding + 10
    var y = this.getGameHeight() - this.windowHeight - this.padding + 10

    this.text = this.scene.make.text({
      x,
      y,
      text,
      style: {
        wordWrap: { width: this.getGameWidth() - this.padding * 2 - 25 }
      }
    })
  }
}
export default DialogService
