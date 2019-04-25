<template>
  <button @click="use" class="inventory-item">
    {{ name }}
  </button>
</template>

<script>
export default {
  props: {
    id: {
      type: String,
      required: true
    },
    name: {
      type: String,
      required: true
    }
  },
  methods: {
    use() {
      this.$emit('use')
      console.log('use')

      document.dispatchEvent(
        new CustomEvent('useItem', { detail: { id: this.id, name: this.name } })
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