<template>
  <section class="overlay">
    <button @click="close" class="overlay__close">&times;</button>
    <section >
      <label class="action" :class="{'action--checked': actionType === 'use' }">Use<input type="radio" name="action" value="use" v-model="actionType" /></label>
      <label class="action" :class="{'action--checked': actionType === 'inspect' }">Inspect<input type="radio" name="action" value="inspect" v-model="actionType" /></label>
    </section>
    <section class="inventory-grid">
      <InventoryItem @interact="interact" v-for="item in inventory" :key="item.uid" :item="item" />
    </section>
  </section>
</template>

<script>
import { mapState, mapMutations } from 'vuex'
import InventoryItem from '@/components/InventoryItem'

export default {
  data() {
    return {
      actionType: 'use'
    }
  },
  components: {
    InventoryItem
  },
  mounted() {
    document.addEventListener('keyup', e => {
      if (e.key === 'Escape') {
        this.close()
      }
    })
  },
  computed: {
    ...mapState(['inventory'])
  },
  methods: {
    ...mapMutations(['disable']),
    interact(item) {
      if (this.actionType === 'use') {
        this.use(item)
      } else {
        this.inspect(item)
      }
    },
    use(item) {
      this.disable()
      document.dispatchEvent(new CustomEvent('useItem', { detail: item }))
      this.close()
    },
    inspect(item) {
      if (!item.zoomable) {
        document.dispatchEvent(new CustomEvent('inspectItem', { detail: item }))
        this.close()
      }
    },
    close() {
      this.$emit('close')
    }
  }
}
</script>

<style lang="scss" scoped>
.overlay {
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  padding: 2rem;
  background: rgba(0,0,0,.7);
  color: #fff;
  &__close {
    position: absolute;
    top: .3rem;
    right: .3rem;
    margin: 0;
    padding: 0 0.5rem;
    background: transparent;
    border: none;
    cursor: pointer;
    color: #fff;
    font-size: 2rem;
  }
}
.inventory-grid {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  grid-column-gap: 1rem;
  grid-row-gap: 1rem;
}

.action {
  display: inline-block;
  width: 7rem;
  margin: 0 0 .5rem;
  padding: .3rem;
  cursor: pointer;
  position: relative;
  text-align: center;
  background: #000;
  color: #ddd;
  &:hover {
    color: #fff;
  }
  &--checked {
    background: blue;
    color: #fff;
  }
  input {
    position: absolute;
    visibility: hidden;
  }
}
</style>