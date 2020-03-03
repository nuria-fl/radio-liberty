<template>
  <Modal @close="close">
    <div>
      <LockDigit v-for="(digit, i) in input" :key="i" @update="update($event, i)" />
    </div>
  </Modal>
</template>

<script>
import LockDigit from '@/components/LockDigit'
import Modal from '@/components/Modal'

export default {
  data() {
    return {
      input: [0, 0, 0, 0]
    }
  },
  components: {
    LockDigit,
    Modal
  },
  computed: {
    valid() {
      return this.input[0] == 1 &&
        this.input[1] == 2 &&
        this.input[2] == 3 &&
        this.input[3] == 4
    }
  },
  methods: {
    update(value, digit) {
      this.input.splice(digit, 1, value)
      if (this.valid) {
        // wait and emit success to phaser
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