import utils from '@/utils/utils'
import { MAX, MAXINVENTORY} from '@/data/constants'

const findIndexById = (uid, collection) => {
  return collection.findIndex((item) => item.uid === uid)
}

export default {
  pauseGame(state) {
    state.paused = true
    state.disabled = true
  },
  playGame(state) {
    state.paused = false
    state.disabled = false
  },
  decrease(state, {stat, amount}) {
    state.stats[stat] = state.stats[stat] - amount
    if (state.stats[stat] <= 0) {
      state.gameOver = true
      state.causeOfDeath = stat
      state.disabled = true
    }
  },
  increase(state, {stat, amount}) {
    state.stats[stat] = state.stats[stat] + amount
    if (state.stats[stat] > MAX) {
      state.stats[stat] = MAX
    }
  },
  addInventory(state, item) {
    if (state.inventory.length < MAXINVENTORY) {
      item.uid = utils.generateId()
      state.inventory.push(item)
    }
  },
  removeInventory(state, uid) {
    const idx = findIndexById(uid, state.inventory)

    if (idx !== -1) {
      state.inventory.splice(idx, 1)
    }
  },
  disable(state) {
    state.disabled = true
  },
  enable(state) {
    state.disabled = false
  },
  getSick(state) {
    state.isSick = true
  },
  getCured(state) {
    state.isSick = false
    state.stats.health = MAX
  }
}
