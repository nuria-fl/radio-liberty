<template>
  <div class="overlay">
    <h1>End of chapter one</h1>
    <h2>
      A game by <a href="https://www.nuriasatorres.com/">Núria</a><br />
      Thank you for playing
    </h2>

    <button @click="restart">Start new game</button>
  </div>
</template>

<script>
export default {
  methods: {
    restart() {
      window.location.reload()
    }
  }
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
  text-align: center;
  a {
    color: #fff;
    text-decoration: underline;
  }
}
</style>
