import { BaseScene } from '../scenes/BaseScene'
import Survivor from '../sprites/Survivor'
import { IMAGES, AUDIO } from '../constants'

export const preloadSurvivor = (scene: BaseScene) => {
  scene.load.spritesheet(
    IMAGES.SURVIVOR.KEY,
    `/images/${IMAGES.SURVIVOR.FILE}`,
    {
      frameWidth: 132,
      frameHeight: 120
    }
  )
  scene.load.audio(AUDIO.WALK.KEY, `/sound/${AUDIO.WALK.FILE}`)
}

export const preloadBuggy = (scene: BaseScene) => {
  scene.load.spritesheet(IMAGES.BUGGY.KEY, `/images/${IMAGES.BUGGY.FILE}`, {
    frameWidth: 208,
    frameHeight: 108
  })
}

export const preloadStranger = (scene: BaseScene) => {
  scene.load.spritesheet(
    IMAGES.STRANGER.KEY,
    `/images/${IMAGES.STRANGER.FILE}`,
    {
      frameWidth: 32,
      frameHeight: 100
    }
  )
}

export const loadSurvivor = (scene: BaseScene, x = 100, y = 510) => {
  return new Survivor({
    scene,
    key: IMAGES.SURVIVOR.KEY,
    x,
    y
  })
}

export const setupInput = (character: Survivor, scene: BaseScene) => {
  scene.input.on('pointerdown', pointer => {
    if (scene.playingCutscene === false && !character.isDown) {
      // remove all interactions
      Object.keys(scene.interact).forEach(k => {
        scene.sys.events.off(
          scene.interact[k].key,
          scene.interact[k].cb,
          scene,
          false
        )
      })

      character.setDestination(pointer.worldX)
      scene.physics.moveTo(character, pointer.worldX, character.y, 100)
    }
  })
}
