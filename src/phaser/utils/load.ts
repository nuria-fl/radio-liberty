import { BaseScene } from "../scenes/BaseScene";
import Survivor from "../sprites/Survivor";
import { IMAGES, AUDIO } from "../constants";

export const preloadSurvivor = (scene: BaseScene) => {
  scene.load.spritesheet(
    IMAGES.SURVIVOR.KEY,
    `/images/${IMAGES.SURVIVOR.FILE}`,
    {
      frameWidth: 40,
      frameHeight: 120
    }
  );
  scene.load.audio(AUDIO.WALK.KEY, `/sound/${AUDIO.WALK.FILE}`);
};

export const preloadBuggy = (scene: BaseScene) => {
  scene.load.spritesheet(IMAGES.BUGGY.KEY, `/images/${IMAGES.BUGGY.FILE}`, {
    frameWidth: 208,
    frameHeight: 108
  });
};

export const loadSurvivor = (scene: BaseScene, x = 100, y = 352) => {
  scene.anims.create({
    key: "walk",
    frames: scene.anims.generateFrameNumbers(IMAGES.SURVIVOR.KEY, {
      start: 0,
      end: 3
    }),
    frameRate: 7,
    repeat: -1
  });

  return new Survivor({
    scene,
    key: IMAGES.SURVIVOR.KEY,
    x,
    y
  });
};

export const setupInput = (character: Survivor, scene: BaseScene) => {
  scene.input.on("pointerdown", pointer => {
    if (scene.playingCutscene === false) {
      character.setDestination(pointer.downX);
      scene.physics.moveTo(character, pointer.downX, character.y, 100);
    }
  });
};
