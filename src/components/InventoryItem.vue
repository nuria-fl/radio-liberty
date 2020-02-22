<template>
  <button @click="interact" class="inventory-item">
    {{ item.name }}
  </button>
</template>

<script>
export default {
  props: {
    item: {
      type: Object,
      required: true
    }
  },
  methods: {
    interact() {
      this.$emit('interact', this.item)
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