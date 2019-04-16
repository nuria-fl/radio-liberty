import { MAX } from '@/data/constants'


export default {
  gameOver: false,
  paused: false,
  isSick: false,
  stats: {
    health: MAX,
    water: MAX,
    food: MAX
  },
  inventory: []
}
