<template>
  <div class="overlay">
    <button @click="close" class="overlay__close">&times;</button>
    <div class="inventory-grid">
      <div class="inventory-grid__item">
        Taser gun
      </div>
      <div class="inventory-grid__item">
        Notebook
      </div>
      <div class="inventory-grid__item">
        Radio
      </div>
      <div v-for="item in inventory" :key="item.uid" class="inventory-grid__item">
        {{ item.name }}
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  mounted() {
    document.addEventListener('keyup', e => {
      if (e.key === 'Escape') {
        this.close()
      }
    })
  },
  computed: {
    ...mapState(['inventory']),
    orderedList() {
      return this.inventory
        .reduce((accumulator, current) => {
          const item = { ...current }
          const alreadyExistingItem = accumulator.find(
            accItem => accItem.id === item.id
          )

          if (alreadyExistingItem) {
            alreadyExistingItem.amount++
          } else {
            item.amount = 1
            accumulator.push(item)
          }

          return accumulator
        }, [])
        .sort((a, b) => {
          if (a.id < b.id) {
            return -1
          }
          if (a.id > b.id) {
            return 1
          }
          return 0
        })
    }
  },
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
  background: rgba(0,0,0,.7);
  color: #fff;
  &__close {
    position: absolute;
    top: .3rem;
    right: .3rem;
    margin: 0;
    padding: 0 0.5rem;
    background: transparent;
    border: none;
    cursor: pointer;
    color: #fff;
    font-size: 2rem;
  }
}
.inventory-grid {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  grid-column-gap: 1rem;
  grid-row-gap: 1rem;
  &__item {
    min-height: 5rem;
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgba(0,0,0,.7);
  }
}
</style>