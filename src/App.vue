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
    document.addEventListener('startChapter2', this.setUpChapter2)
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
    document.removeEventListener('startChapter2', this.setUpChapter2)
  },
  methods: {
    ...mapMutations(['enable', 'disable', 'startGame']),
    ...mapActions([
      'initInventory',
      'decrease',
      'pauseScene',
      'resumeScene',
      'addToInventory',
      'removeFromInventory',
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
    setUpChapter2() {
      this.removeFromInventory('water-clean')
      this.decrease({ stat: 'water', amount: 60 })
      this.decrease({ stat: 'food', amount: 30 })
      const items = ['page-7', 'page-8', 'page-9', 'idCard', 'brokenGlass']
      items.forEach((item) => this.addToInventory(item))
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
