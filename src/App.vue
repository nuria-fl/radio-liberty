<template>
  <div class="game-overlay">
    <Stats/>
    <Inventory />
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { mapActions } from 'vuex'
import Stats from '@/components/Stats.vue'
import Inventory from '@/components/Inventory.vue'

export default Vue.extend({
  components: {
    Stats,
    Inventory
  },
  mounted() {
    this.initInventory()
  },
  methods: {
    ...mapActions(['initInventory'])
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
