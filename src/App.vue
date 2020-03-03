<template>
  <div class="game-overlay" v-if="started">
    <GameOver v-if="gameOver"/>
    <template v-else>
      <Stats/>
      <Inventory v-show="enabled" />
      <Lock v-if="showLock" @close="showLock = false" />
    </template>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { mapState, mapMutations, mapActions } from 'vuex'
import GameOver from '@/components/GameOver.vue'
import Stats from '@/components/Stats.vue'
import Inventory from '@/components/Inventory.vue'
import Lock from '@/components/Lock.vue'

export default Vue.extend({
  components: {
    GameOver,
    Stats,
    Inventory,
    Lock
  },
  data() {
    return {
      showLock: true
    }
  },
  computed: {
    ...mapState(['gameOver', 'enabled', 'started'])
  },
  methods: {
    ...mapMutations(['enable', 'disable', 'startGame']),
    ...mapActions(['initInventory', 'decrease']),
    endGame() {
      this.decrease({ stat: 'health', amount: 100 })
    }
  },
  mounted() {
    this.initInventory()
    document.addEventListener('startGame', this.startGame)
    document.addEventListener('endGame', this.endGame)
    document.addEventListener('playCutscene', this.disable)
    document.addEventListener('stopCutscene', this.enable)
    document.addEventListener('showLock', () => {
      this.showLock = true
    })
  },
  beforeDestroy() {
    document.removeEventListener('startGame', this.startGame)
    document.removeEventListener('endGame', this.endGame)
    document.removeEventListener('playCutscene', this.disable)
    document.removeEventListener('stopCutscene', this.enable)
  }
})
</script>

<style lang="scss">
*, *:before, *:after {
  box-sizing: border-box;
}

.game-overlay {
  font-family: monospace;
}
</style>
