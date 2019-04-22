<template>
  <div class="game-overlay" v-if="!gameOver">
    <Stats/>
    <Inventory v-show="enabled" />
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { mapState, mapMutations, mapActions } from 'vuex'
import Stats from '@/components/Stats.vue'
import Inventory from '@/components/Inventory.vue'

export default Vue.extend({
  components: {
    Stats,
    Inventory
  },
  computed: {
    ...mapState(['gameOver', 'enabled'])
  },
  methods: {
    ...mapMutations(['enable', 'disable']),
    ...mapActions(['initInventory'])
  },
  mounted() {
    this.initInventory()
    document.addEventListener('playCutscene', this.disable)
    document.addEventListener('stopCutscene', this.enable)
  },
  beforeDestroy() {
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
