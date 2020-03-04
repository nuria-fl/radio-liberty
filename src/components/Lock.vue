<template>
  <Modal @close="close">
    <div>
      <LockDigit v-for="(digit, i) in input" :key="i" @update="update($event, i)" :disabled="disabled" />
    </div>
  </Modal>
</template>

<script>
import { mapActions } from 'vuex'
import LockDigit from '@/components/LockDigit'
import Modal from '@/components/Modal'

export default {
  data() {
    return {
      input: [0, 0, 0, 0],
      disabled: false
    }
  },
  components: {
    LockDigit,
    Modal
  },
  computed: {
    valid() {
      return this.input[0] == 3 &&
        this.input[1] == 6 &&
        this.input[2] == 1 &&
        this.input[3] == 8
    }
  },
  methods: {
    ...mapActions(['addToInventory']),
    update(value, digit) {
      this.input.splice(digit, 1, value)
      if (this.valid) {
        this.disabled = true
        setTimeout(() => {
          this.addToInventory('solution')
          this.addToInventory('smallKey')
          this.close()
          document.dispatchEvent(new CustomEvent('unlock'))
        }, 1000)
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