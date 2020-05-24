import { MAX } from '@/data/constants'
import items from '@/data/items'

export default {
  started: false,
  gameOver: true,
  paused: false,
  enabled: false,
  isSick: false,
  loop: null,
  pages: 4,
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
      id: 'notebook',
      name: 'Notebook',
      description: null,
      consumable: false,
      zoomable: true,
    },
    {
      id: 'radio',
      name: 'Radio',
      description: "It's just picking static",
      consumable: false,
    },
  ],
  existingItems: items,
}
