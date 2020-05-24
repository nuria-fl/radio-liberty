<template>
  <div class="notebook">
    <button
      class="notebook__btn notebook__btn--prev"
      :disabled="!canGoPrev"
      @click="prev"
    ></button>
    <button
      class="notebook__btn notebook__btn--next"
      :disabled="!canGoNext"
      @click="next"
    ></button>
    <img :src="`/images/notebook/page${currentPage}.png`" alt="" />
  </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  data() {
    return {
      currentPage: 1,
    }
  },
  created() {
    this.currentPage = this.pages
  },
  computed: {
    ...mapState(['pages']),
    canGoNext() {
      return this.currentPage < this.pages
    },
    canGoPrev() {
      return this.currentPage > 1
    },
  },
  methods: {
    next() {
      if (this.canGoNext) {
        this.currentPage++
      }
    },
    prev() {
      if (this.canGoPrev) {
        this.currentPage--
      }
    },
  },
}
</script>

<style lang="scss" scoped>
.notebook {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  position: relative;
  background: url('/images/common/notebook.png') no-repeat;
  background-size: cover;
  &__btn {
    position: absolute;
    top: 0;
    width: 50%;
    height: 100%;
    padding: 0;
    margin: 0;
    background: transparent;
    border: none;
    &:not(:disabled) {
      cursor: pointer;
    }
    &--next {
      right: 0;
    }
    &--prev {
      left: 0;
    }
  }
}
</style>
