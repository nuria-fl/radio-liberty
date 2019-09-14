import { BaseScene } from '../scenes/BaseScene'
import Survivor from '../sprites/Survivor'
import { IMAGES, AUDIO } from '../constants'

export const preloadSurvivor = (scene: BaseScene) => {
  scene.load.spritesheet(
    IMAGES.SURVIVOR.KEY,
    `/images/${IMAGES.SURVIVOR.FILE}`,
    {
      frameWidth: 40,
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

export const loadSurvivor = (scene: BaseScene, x = 100, y = 510) => {
  scene.anims.create({
    key: 'walk',
    frames: scene.anims.generateFrameNumbers(IMAGES.SURVIVOR.KEY, {
      start: 0,
      end: 3
    }),
    frameRate: 7,
    repeat: -1
  })

  return new Survivor({
    scene,
    key: IMAGES.SURVIVOR.KEY,
    x,
    y
  })
}

export const setupInput = (character: Survivor, scene: BaseScene) => {
  scene.input.on('pointerdown', pointer => {
    // remove all interactions
    Object.keys(scene.interact).forEach(k => {
      scene.sys.events.off(
        scene.interact[k].key,
        scene.interact[k].cb,
        scene,
        false
      )
    })

    if (scene.playingCutscene === false) {
      character.setDestination(pointer.worldX)
      scene.physics.moveTo(character, pointer.worldX, character.y, 100)
    }
  })
}
