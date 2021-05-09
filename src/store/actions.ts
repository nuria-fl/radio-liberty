import { MAX } from '@/data/constants'

export default {
  gameOver({ state, commit }) {
    commit('pauseGame')
    commit('gameOver')
    commit('setLoop', null)
    clearTimeout(state.loop)
    document.dispatchEvent(new Event('gameOver'))
  },
  pauseScene({ commit }) {
    commit('pauseGame')
    document.dispatchEvent(new CustomEvent('pauseScene'))
  },
  resumeScene({ commit }) {
    commit('playGame')
    document.dispatchEvent(new CustomEvent('resumeScene'))
  },
  decrease({ state, commit, dispatch }, { stat, amount }) {
    const newAmount = state.stats[stat] - amount
    const isOver = newAmount <= 0
    commit('setStat', { stat, amount: isOver ? 0 : newAmount })
    if (state.enabled && isOver) {
      dispatch('gameOver')
    }
  },
  increase({ state, commit }, { stat, amount }) {
    if (stat === 'energy') {
      return
    }
    const newAmount = state.stats[stat] + amount
    commit('setStat', { stat, amount: newAmount > MAX ? MAX : newAmount })
  },
  decreaseStats({ state, commit, dispatch }) {
    const decreaseInterval = 1000
    const loop = setTimeout(() => {
      if (!state.gameOver && !state.paused) {
        dispatch('decrease', { stat: 'water', amount: 0.3 })
        dispatch('decrease', { stat: 'food', amount: 0.2 })
        if (state.isSick) {
          dispatch('decrease', { stat: 'health', amount: 1 })
        }
      }
      dispatch('decreaseStats')
    }, decreaseInterval)
    commit('setLoop', loop)
  },
  initInventory({ dispatch }) {
    dispatch('addToInventory', 'water-clean')
  },
  addToInventory({ state, commit }, itemId: string) {
    const item = state.existingItems.find((item) => item.id === itemId)

    if (item.type === 'note') {
      const page = parseInt(item.id.split('-')[1], 10)
      commit('addNote', page)
      return true
    } else {
      commit('addInventory', item)
      return false
    }
  },
  removeFromInventory({ state, commit }, itemId: string) {
    const itemInventory = state.inventory.find((item) => item.id === itemId)

    commit('removeInventory', itemInventory.uid)
  },
  consume({ state, commit, dispatch }, itemId: string) {
    if (itemId === 'waterCollector') {
      return dispatch('increase', {
        stat: 'water',
        amount: 100,
      })
    }

    const item = state.inventory.find((item) => item.id === itemId)

    if (item) {
      Object.keys(item.value).forEach((stat) => {
        dispatch('increase', {
          stat,
          amount: item.value[stat],
        })
      })

      commit('removeInventory', item.uid)
    } else {
      console.log('item not found', itemId)
    }
  },
}
