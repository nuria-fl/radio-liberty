import { MAX } from '@/data/constants'
import items from '@/data/items'
import recipes from '@/data/recipes'

export default {
  started: false,
  gameOver: true,
  paused: false,
  enabled: false,
  isSick: false,
  loop: null,
  pages: [true, true, true, true, true, true, true, false, false],
  stats: {
    health: MAX,
    water: MAX,
    food: MAX,
  },
  inventory: [
    {
      id: 'taser',
      name: 'Taser gun',
      description: 'In case I need to protect myself',
      consumable: false,
    },
    {
      id: 'radio',
      name: 'Radio',
      description: "It's just picking static",
      consumable: false,
    },
  ],
  recipes,
  existingItems: items,
}
