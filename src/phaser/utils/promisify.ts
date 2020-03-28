export const cameraFade = (
  scene: Phaser.Scene,
  direction: 'fadeIn' | 'fadeOut',
  time = 1000,
  colors = { red: 0, green: 0, blue: 0 }
) => {
  return new Promise(resolve => {
    scene.cameras.main[direction](
      time,
      colors.red,
      colors.green,
      colors.blue,
      (_, progress) => {
        if (progress === 1) {
          resolve()
        }
      }
    )
  })
}

export const cameraPan = (
  scene: Phaser.Scene,
  x: number,
  y: number,
  time = 1000
) => {
  return new Promise(resolve => {
    scene.cameras.main.pan(x, y, time, 'Linear', false, (_, progress) => {
      if (progress === 1) {
        resolve()
      }
    })
  })
}
