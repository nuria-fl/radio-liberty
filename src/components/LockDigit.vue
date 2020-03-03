<template>
  <div>
    <button @click="next">more</button>
    <input type="number" readonly v-model="number" />
    <button @click="prev">less</button>
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex'
import InventoryItem from '@/components/InventoryItem'
import Modal from '@/components/Modal'

export default {
  data() {
    return {
      number: 0
    }
  },
  methods: {
    next() {
      if (this.number === 9) {
        this.number = 0
      } else {
        this.number++
      }
      this.$emit('update', this.number)
    },
    prev() {
      if (this.number === 0) {
        this.number = 9
      } else {
        this.number--
      }
      this.$emit('update', this.number)
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