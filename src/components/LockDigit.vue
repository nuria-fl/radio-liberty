<template>
  <div :class="`digit digit--${number}`">
    <input type="number" readonly v-model="number" />
    <button @click="next" :disabled="disabled">more</button>
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
    }
  }
}
</script>

<style lang="scss" scoped>
.digit {
  width: 64px;
  height: 80px;
  position: relative;
  background: url('/images/digits.png') no-repeat 0 0;
  &--9 {
    background-position: 0 0;
  }
  &--8 {
    background-position: -64px 0;
  }
  &--7 {
    background-position: -(64 * 2) + px 0;
  }
  &--6 {
    background-position: -(64 * 3) + px 0;
  }
  &--5 {
    background-position: -(64 * 4) + px 0;
  }
  &--4 {
    background-position: -(64 * 5) + px 0;
  }
  &--3 {
    background-position: -(64 * 6) + px 0;
  }
  &--2 {
    background-position: -(64 * 7) + px 0;
  }
  &--1 {
    background-position: -(64 * 8) + px 0;
  }
  &--0 {
    background-position: -(64 * 9) + px 0;
  }
  input {
    visibility: hidden;
  }
  button {
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
    background: transparent;
    border: none;
    text-indent: -9999em;
    cursor: pointer;
    &:focus {
      outline: none;
    }
  }
}
</style>