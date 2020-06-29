<template>
  <Modal @close="close">
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
      <div>
        <img
          v-if="pages[currentPage]"
          :src="`/images/notebook/${currentPage}.png`"
          alt=""
        />
      </div>
      <div>
        <img
          v-if="pages[currentPage + 1]"
          :src="`/images/notebook/${currentPage + 1}.png`"
          alt=""
        />
      </div>
    </div>
  </Modal>
</template>

<script>
import { mapState } from 'vuex'
import Modal from '@/components/Modal'

export default {
  components: {
    Modal,
  },
  data() {
    return {
      currentPage: 0,
    }
  },
  computed: {
    ...mapState(['pages']),
    lastAvailablePage() {
      const lastIdx = [...this.pages].reverse().findIndex((page) => page)

      return -(lastIdx - this.pages.length + 1)
    },
    isLeftPage() {
      return this.lastAvailablePage % 2 !== 0
    },
    canGoNext() {
      return (
        this.currentPage <
        (this.isLeftPage ? this.lastAvailablePage - 1 : this.lastAvailablePage)
      )
    },
    canGoPrev() {
      return this.currentPage > 1
    },
  },
  created() {
    this.currentPage = this.isLeftPage
      ? this.lastAvailablePage - 1
      : this.lastAvailablePage
  },
  methods: {
    next() {
      if (this.canGoNext) {
        this.currentPage += 2
      }
    },
    prev() {
      if (this.canGoPrev) {
        this.currentPage -= 2
      }
    },
    close() {
      this.$emit('close')
    },
  },
}
</script>

<style lang="scss" scoped>
.notebook {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  height: 100%;
  padding: 0 5.3rem;
  position: relative;
  background: url('/images/common/notebook.png') no-repeat;
  background-size: cover;
  color: #fff;
  &__btn {
    position: absolute;
    top: 0;
    width: 50%;
    height: 100%;
    padding: 0;
    margin: 0;
    background: transparent;
    border: none;
    &:focus {
      outline: none;
    }
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
