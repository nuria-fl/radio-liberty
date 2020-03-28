<template>
  <ul class="Stats">
    <li
      v-for="(stat, key) in roundedStats"
      :key="key"
      class="Stats__item">
      <span class="Stats__icon">{{ icons[key] }}</span>
      <strong
        :class="{
          warning: stat < 50,
          danger: stat < 20
      }">
        {{ stat }}
      </strong>
    </li>
  </ul>
</template>

<script>
import { mapState, mapActions, mapMutations } from 'vuex'
import eventBus from '@/utils/eventBus'

export default {
  data() {
    return {
      icons: {
        health: '❤️',
        water: '💧',
        food: '🍗'
      }
    }
  },
  mounted() {
    document.addEventListener('getHurt', this.handleHurt)
    document.addEventListener('getCured', this.getCured())
    this.decreaseStats()
  },
  beforeDestroy() {
    document.removeEventListener('getHurt', this.handleHurt)
    document.removeEventListener('getCured', this.getCured())
  },
  computed: {
    ...mapState(['stats']),
    roundedStats() {
      return {
        health: Math.floor(this.stats.health),
        water: Math.floor(this.stats.water),
        food: Math.floor(this.stats.food)
      }
    }
  },
  methods: {
    ...mapMutations(['getCured', 'getSick']),
    ...mapActions(['decrease', 'decreaseStats']),
    handleHurt() {
      this.decrease({ stat: 'health', amount: 20 })
      this.getSick()
    }
  }
}
</script>

<style lang="scss">
  .Stats {
    position: absolute;
    top: 0;
    left: 0;
    display: flex;
    margin: 0;
    padding: 0;
    list-style: none;
    &__item {
      margin: 0;
      white-space: nowrap;
      padding: .1em 1em .1em 0;
      color: #fff;
      @media screen and (min-width: 680px) {
        margin: 1em 0;
        padding-left: 1em;
      }
    }
    &__icon {
      filter: grayscale(50%);
    }
  }
  .warning {
    color: #fa0;
  }
  .danger {
    color: #c00;
  }
</style>
