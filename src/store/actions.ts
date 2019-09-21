import { MAX } from '@/data/constants'

export default {
  gameOver({ commit }) {
    commit('pauseGame')
    commit('gameOver')
    document.dispatchEvent(new Event('gameOver'))
  },
  decrease({ state, commit, dispatch }, { stat, amount }) {
    const newAmount = state.stats[stat] - amount
    const isOver = newAmount <= 0
    commit('setStat', { stat, amount: isOver ? 0 : newAmount })
    if (isOver) {
      dispatch('gameOver')
    }
  },
  increase({ state, commit }, { stat, amount }) {
    if (stat === 'energy') { return }
    const newAmount = state.stats[stat] + amount
    commit('setStat', { stat, amount: newAmount > MAX ? MAX : newAmount })
  },
  initInventory({ dispatch }) {
    dispatch('addToInventory', 'water-clean')
  },
  addToInventory({ state, commit }, itemId: string) {
    const item = state.existingItems.find(item => item.id === itemId)

    commit('addInventory', item)
  },
  consume({ state, commit, dispatch }, itemId: string) {
    const item = state.inventory.find(item => item.id === itemId)

    console.log(item)

    if (item) {
      Object.keys(item.value).forEach(stat => {
        dispatch('increase', {
          stat,
          amount: item.value[stat]
        })
      })

      commit('removeInventory', item.uid)
    } else {
      console.log('item not found', itemId)
    }
  }
}
