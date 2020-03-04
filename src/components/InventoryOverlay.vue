<template>
  <Modal @close="close">
    <template v-if="zoomedItem">
      <img :src="`/images/${zoomedItem}.png`" class="zoomed-image" alt="">
    </template>
    <template v-else>
      <section>
        <label class="action" :class="{'action--checked': actionType === 'use' }">Use<input type="radio" name="action" value="use" v-model="actionType" /></label>
        <label class="action" :class="{'action--checked': actionType === 'inspect' }">Inspect<input type="radio" name="action" value="inspect" v-model="actionType" /></label>
      </section>
      <section class="inventory-grid">
        <InventoryItem @interact="interact" v-for="item in inventory" :key="item.uid" :item="item" />
      </section>
    </template>
  </Modal>
</template>

<script>
import { mapState, mapMutations } from 'vuex'
import InventoryItem from '@/components/InventoryItem'
import Modal from '@/components/Modal'

export default {
  data() {
    return {
      actionType: 'use',
      zoomedItem: null
    }
  },
  components: {
    InventoryItem,
    Modal
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
      if (item.zoomable) {
        this.zoom(item.id)
      } else {
        document.dispatchEvent(new CustomEvent('inspectItem', { detail: item }))
        this.close()
      }
    },
    zoom(item) {
      this.zoomedItem = item
    },
    close() {
      this.zoomedItem = null
      this.$emit('close')
    }
  }
}
</script>

<style lang="scss" scoped>
.inventory-grid {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  grid-column-gap: 1rem;
  grid-row-gap: 1rem;
}

.zoomed-image {
  width: 100%;
  height: 100%;
  object-fit: contain;
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