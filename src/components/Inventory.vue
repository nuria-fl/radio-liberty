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
    ...mapActions(['addToInventory']),
    openInventory() {
      this.showInventory = true
    },
    closeInventory() {
      this.showInventory = false
    },
    handlePickUp(ev) {
      this.addToInventory(ev.detail)
    }
  },
  mounted() {
    document.addEventListener('pickUp', this.handlePickUp)
  },
  beforeDestroy() {
    document.removeEventListener('pickUp', this.handlePickUp)
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
