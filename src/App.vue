<template>
  <div v-if="started" class="game-overlay">
    <Credits v-if="gameComplete" />
    <GameOver v-else-if="gameOver" />
    <template v-else>
      <Stats />
      <Inventory v-show="enabled" />
      <Lock v-if="showLock" @close="hideLock" />
    </template>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { mapState, mapMutations, mapActions } from 'vuex'
import GameOver from '@/components/GameOver.vue'
import Credits from '@/components/Credits.vue'
import Stats from '@/components/Stats.vue'
import Inventory from '@/components/Inventory.vue'
import Lock from '@/components/Lock.vue'

export default Vue.extend({
  components: {
    GameOver,
    Credits,
    Stats,
    Inventory,
    Lock,
  },
  data() {
    return {
      showLock: false,
      gameComplete: false,
    }
  },
  computed: {
    ...mapState(['gameOver', 'enabled', 'started']),
  },
  mounted() {
    this.initInventory()
    document.addEventListener('startGame', this.startGame)
    document.addEventListener('endGame', this.endGame)
    document.addEventListener('completeGame', this.completeGame)
    document.addEventListener('playCutscene', this.disable)
    document.addEventListener('stopCutscene', this.enable)
    document.addEventListener('showLock', this.displayLock)
    document.addEventListener('startBuildingScene', this.setUpFromBuildingScene)
  },
  beforeDestroy() {
    document.removeEventListener('startGame', this.startGame)
    document.removeEventListener('endGame', this.endGame)
    document.removeEventListener('completeGame', this.completeGame)
    document.removeEventListener('playCutscene', this.disable)
    document.removeEventListener('stopCutscene', this.enable)
    document.removeEventListener('showLock', this.displayLock)
    document.removeEventListener(
      'startBuildingScene',
      this.setUpFromBuildingScene
    )
  },
  methods: {
    ...mapMutations(['enable', 'disable', 'startGame']),
    ...mapActions([
      'initInventory',
      'decrease',
      'pauseScene',
      'resumeScene',
      'addToInventory',
    ]),
    endGame() {
      this.decrease({ stat: 'health', amount: 100 })
    },
    completeGame() {
      this.disable()
      this.gameComplete = true
    },
    displayLock() {
      this.showLock = true
      this.pauseScene()
    },
    hideLock() {
      this.showLock = false
      this.resumeScene()
    },
    setUpFromBuildingScene() {
      this.decrease({ stat: 'water', amount: 20 })
      this.decrease({ stat: 'food', amount: 10 })
      this.addToInventory('pinecone')
      this.addToInventory('page-7')
    },
  },
})
</script>

<style lang="scss">
*,
*:before,
*:after {
  box-sizing: border-box;
}

.game-overlay {
  font-family: monospace;
}
</style>
