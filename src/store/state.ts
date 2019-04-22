import { MAX } from '@/data/constants'
import items from '@/data/items'

export default {
  gameOver: false,
  paused: false,
  enabled: false,
  isSick: false,
  stats: {
    health: MAX,
    water: MAX,
    food: MAX
  },
  inventory: [],
  existingItems: items
}
