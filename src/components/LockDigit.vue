<template>
  <div>
    <button @click="next" :disabled="disabled">more</button>
    <input type="number" readonly v-model="number" />
    <button @click="prev" :disabled="disabled">less</button>
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
  props: {
    disabled: {
      type: Boolean,
      default: false
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
</style>