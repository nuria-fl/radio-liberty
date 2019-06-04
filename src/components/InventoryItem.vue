<template>
  <button @click="use" class="inventory-item">
    {{ name }}
  </button>
</template>

<script>
import { mapMutations } from 'vuex';

export default {
  props: {
    id: {
      type: String,
      required: true
    },
    name: {
      type: String,
      required: true
    },
    consumable: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    ...mapMutations(['disable']),
    use() {
      this.$emit('use')
      this.disable();

      document.dispatchEvent(
        new CustomEvent('useItem', { detail: { id: this.id, name: this.name, consumable: this.consumable} })
      )
    }
  }
}
</script>

<style lang="scss" scoped>
.inventory-item {
  min-height: 5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  background: rgba(0,0,0,.7);
  border: none;
  color: #fff;
  cursor: pointer;
}
</style>