<template>
  <div>
    <button class="inventory-btn" @click="openInventory">Inventory</button>
    <InventoryOverlay v-if="showInventory" @close="closeInventory" />
  </div>
</template>

<script lang="ts">
import { mapActions } from 'vuex'
import InventoryOverlay from '@/components/InventoryOverlay.vue'

export default {
  components: {
    InventoryOverlay,
  },
  data() {
    return {
      showInventory: false,
    }
  },
  mounted() {
    document.addEventListener('pickUp', this.handlePickUp)
    document.addEventListener('removeItem', this.handleRemove)
    document.addEventListener('consume', this.handleConsume)
  },
  beforeDestroy() {
    document.removeEventListener('pickUp', this.handlePickUp)
    document.removeEventListener('removeItem', this.handleRemove)
  },
  methods: {
    ...mapActions([
      'addToInventory',
      'removeFromInventory',
      'consume',
      'pauseScene',
      'resumeScene',
    ]),
    openInventory() {
      this.showInventory = true
      this.pauseScene()
    },
    closeInventory() {
      this.showInventory = false
      this.resumeScene()
    },
    handlePickUp({ detail }) {
      this.addToInventory(detail)
    },
    handleRemove({ detail }) {
      this.removeFromInventory(detail.id)
    },
    handleConsume({ detail }) {
      this.consume(detail.id)
    },
  },
}
</script>

<style lang="scss">
.game-overlay {
  font-family: monospace;
}
.inventory-btn {
  position: absolute;
  bottom: 0;
  right: 0;
}
</style>
