<template>
  <div>
    <div class="actions">
      <button ref="notebook" class="btn" @click="openNotebook">
        <img src="@/assets/notebook-icon.png" alt="notebook" />
      </button>
      <button class="btn" @click="openInventory">
        <img src="@/assets/backpack.png" alt="backpack" />
      </button>
    </div>
    <Notebook v-if="showNotebook" @close="closeNotebook" />
    <InventoryOverlay v-if="showInventory" @close="closeInventory" />
  </div>
</template>

<script lang="ts">
import { mapActions } from 'vuex'
import InventoryOverlay from '@/components/InventoryOverlay.vue'
import Notebook from '@/components/Notebook.vue'

export default {
  components: {
    InventoryOverlay,
    Notebook,
  },
  data() {
    return {
      showInventory: false,
      showNotebook: false,
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
    openNotebook() {
      this.showNotebook = true
      this.pauseScene()
    },
    closeNotebook() {
      this.showNotebook = false
      this.resumeScene()
    },
    buzz() {
      this.$refs.notebook.classList.add('btn--buzz')
      setTimeout(() => {
        this.$refs.notebook.classList.remove('btn--buzz')
      }, 1000)
    },
    openInventory() {
      this.showInventory = true
      this.pauseScene()
    },
    closeInventory() {
      this.showInventory = false
      this.resumeScene()
    },
    handlePickUp({ detail }) {
      this.addToInventory(detail).then((isNote) => {
        if (isNote) {
          this.buzz()
        }
      })
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
.actions {
  position: absolute;
  bottom: 0;
  right: 0;
  display: flex;
}
.btn {
  background: transparent;
  border: none;
  padding: 0.5rem;
  img {
    display: block;
    transition: transform 0.3s;
  }
  &:hover,
  &:focus {
    outline: none;
    cursor: pointer;
    img {
      transform: translateY(-0.5rem);
    }
  }
  &--buzz {
    animation: buzz 0.3s linear 0s 3;
  }
}

@keyframes buzz {
  0% {
    transform: translateX(0);
  }
  25% {
    transform: translateX(-0.5rem);
  }
  50% {
    transform: translateX(0rem);
  }
  75% {
    transform: translateX(0.5rem);
  }
  100% {
    transform: translateX(0);
  }
}
</style>
