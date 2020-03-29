<template>
  <section class="overlay">
    <button class="overlay__close" @click="close">&times;</button>
    <slot></slot>
  </section>
</template>

<script>
export default {
  methods: {
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
  background: rgba(0, 0, 0, 0.7);
  color: #fff;
  &__close {
    position: absolute;
    top: 0.3rem;
    right: 0.3rem;
    margin: 0;
    padding: 0 0.5rem;
    background: transparent;
    border: none;
    cursor: pointer;
    color: #fff;
    font-size: 2rem;
  }
}
</style>
