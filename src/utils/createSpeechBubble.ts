const createSpeechBubble = (
  bubbleConfig: {
    width: number
    height: number
    quote: string
  },
  charachterBody: any,
  ctx
) => {
  const { width, height, quote } = bubbleConfig
  const bubblePadding = 10
  const bubbleRadius = 10
  // const arrowHeight = height / 4

  // Calculate bubble position from character position
  const x = charachterBody.x + charachterBody.halfWidth - width / 2
  const y = charachterBody.y - height

  const bubble = ctx.add.graphics({ x, y })

  bubble.fillStyle(0xffffff, 1)
  bubble.fillRoundedRect(0, 0, width, height, bubbleRadius)

  //  Calculate arrow coordinates
  // var point1X = Math.floor(width / 7)
  // var point1Y = height
  // var point2X = Math.floor((width / 7) * 2)
  // var point2Y = height
  // var point3X = Math.floor(width / 7)
  // var point3Y = Math.floor(height + arrowHeight)

  // bubble.fillTriangle(point1X, point1Y, point2X, point2Y, point3X, point3Y)
  // bubble.lineBetween(point2X, point2Y, point3X, point3Y)
  // bubble.lineBetween(point1X, point1Y, point3X, point3Y)

  const content = ctx.add.text(0, 0, quote, {
    fontFamily: 'Arial',
    fontSize: 16,
    color: '#000000',
    align: 'center',
    wordWrap: { width: width - bubblePadding * 2 }
  })

  const contentBounds = content.getBounds()

  content.setPosition(
    bubble.x + width / 2 - contentBounds.width / 2,
    bubble.y + height / 2 - contentBounds.height / 2
  )

  setTimeout(() => {
    bubble.destroy()
    content.destroy()
  }, 3000)
}

export default createSpeechBubble
