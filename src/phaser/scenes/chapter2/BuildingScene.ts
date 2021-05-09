import BaseBuildingScene from '../BaseBuildingScene'
import { SCENES } from '../../constants'
import { Bucket } from '@/phaser/sprites/Bucket'

class C2BuildingScene extends BaseBuildingScene {
  constructor() {
    super({
      key: SCENES.C2BUILDING,
    })

    this.interact = {
      ...this.interact,
      bucket: {
        key: 'interactBucket',
        text: 'Drink water',
        cb: this.interactBucket,
      },
    }
  }

  public preload() {
    super.preload()
  }

  // eslint-disable-next-line @typescript-eslint/require-await
  public async create() {
    document.dispatchEvent(new CustomEvent('startChapter2'))
    super.create()
  }

  public update() {
    super.update()
  }

  public createSprites() {
    super.createSprites()

    this.bucket = new Bucket({
      scene: this,
      x: 605,
      y: 660,
    })
    this.physics.add.collider(this.platforms, this.bucket)
    this.bucket.play('bucketFull')
    this.bucket.setInteractive()
  }

  public async initCutscene() {
    super.initCutscene()
    await this.createDialog(
      'I should explore a bit the area and see if I can find a replacement battery for the buggy.'
    )
  }

  public interactBucket() {
    this.finishInteraction()
    if (this.isWaterCollectorFull) {
      document.dispatchEvent(
        new CustomEvent('consume', {
          detail: { id: 'waterCollector' },
        })
      )
      this.createDialog('Refreshing.')
      this.isWaterCollectorFull = false
      this.bucket.play('bucketEmpty')
    } else {
      this.createDialog("There's not enough water yet.")
    }
  }

  public interactPit() {
    this.finishInteraction()
    this.createDialog("I'll need some more wood for tonight.")
  }
}

export default C2BuildingScene
