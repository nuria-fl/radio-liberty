<template>
  <div>
    <button @click="openInventory" class="inventory-btn">Inventory</button>
    <InventoryOverlay v-if="showInventory" @close="closeInventory"/>
  </div>
</template>

<script lang="ts">
import { mapActions } from 'vuex'
import Stats from '@/components/Stats.vue'
import InventoryOverlay from '@/components/InventoryOverlay.vue'

export default {
  components: {
    InventoryOverlay
  },
  data() {
    return {
      showInventory: false
    }
  },
  methods: {
    ...mapActions(['addToInventory', 'removeFromInventory', 'consume']),
    openInventory() {
      this.showInventory = true
    },
    closeInventory() {
      this.showInventory = false
    },
    handlePickUp({ detail }) {
      this.addToInventory(detail)
    },
    handleRemove({ detail }) {
      this.removeFromInventory(detail.id)
    },
    handleConsume({ detail }) {
      this.consume(detail.id)
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
  }
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
