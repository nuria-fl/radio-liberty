<template>
  <Modal @close="close">
    <div class="lock">
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
.lock {
  display: flex;
  align-items: center;
  justify-content: space-around;
  width: 100%;
  height: 100%;
  padding: 9rem 10.8rem 11.3rem;
  background: url('/images/lock.png');
  background-size: cover;
}
</style>