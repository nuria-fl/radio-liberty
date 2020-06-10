import utils from '@/utils/utils'
import { MAX, MAXINVENTORY } from '@/data/constants'

const findIndexById = (uid, collection) => {
  return collection.findIndex((item) => item.uid === uid)
}

export default {
  gameOver(state) {
    state.gameOver = true
  },
  startGame(state) {
    state.started = true
    state.gameOver = false
  },
  pauseGame(state) {
    state.paused = true
  },
  playGame(state) {
    state.paused = false
  },
  enable(state) {
    state.enabled = true
  },
  disable(state) {
    state.enabled = false
  },
  setStat(state, { stat, amount }) {
    state.stats[stat] = amount
  },
  addNote(state, note) {
    state.pages[note] = true
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
  getSick(state) {
    state.isSick = true
  },
  getCured(state) {
    state.isSick = false
    state.stats.health = MAX
  },
  setLoop(state, loop) {
    state.loop = loop
  },
}
