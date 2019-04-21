<template>
  <div class="game-overlay">
    <Stats/>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import Stats from '@/components/Stats.vue'

export default Vue.extend({
  components: {
    Stats
  }
})
</script>

<style lang="scss">
.game-overlay {
  position: absolute;
  top: 0;
  left: 0;
  font-family: monospace;
}
</style>
