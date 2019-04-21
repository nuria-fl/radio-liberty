import { MAX } from '@/data/constants'

export default {
  gameOver({commit}) {
    commit('pauseGame')
    commit('gameOver')
    document.dispatchEvent(new Event('gameOver'))
  },
  decrease({state, commit, dispatch}, {stat, amount}) {
    const newAmount = state.stats[stat] - amount
    const isOver = newAmount <= 0
    commit('setStat', {stat, amount: isOver ? 0 : newAmount })
    if (isOver) {
      dispatch('gameOver')
    }
  },
  increase({state, commit}, {stat, amount}) {
    const newAmount = state.stats[stat] - amount
    commit('setStat', {stat, amount: newAmount > MAX ? MAX : newAmount})
  }
}
