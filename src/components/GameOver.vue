<template>
  <div class="overlay">
    <h1>Game Over</h1>

    <button @click="restart">Start new game</button>
  </div>
</template>

<script>
export default {
  methods: {
    restart() {
      window.location.reload()
    },
  },
}
</script>

<style lang="scss" scoped>
.overlay {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  background: rgba(0, 0, 0, 0.8);
  color: #fff;
  button {
    background: transparent;
    border: 1px solid;
    color: #fff;
    font-family: monospace;
    font-size: 1rem;
    cursor: pointer;
    margin: 1rem auto;
    padding: .5rem;
    &:hover {
      background: #fff;
      color: #000;
    }
  }
}
</style>
