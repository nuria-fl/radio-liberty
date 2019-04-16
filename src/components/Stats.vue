<template>
  <ul class="Stats">
    <li
      v-for="(stat, key) in stats"
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
import { mapState, mapActions } from 'vuex'
import eventBus from '@/utils/eventBus'

export default {
  data () {
    return {
      loop: null,
      icons: {
        health: '❤️',
        water: '💧',
        food: '🍗'
      }
    }
  },
  mounted () {
    document.addEventListener('gameStatusChange', this.handleGameStatusChange)
    this.startGameLoop()
  },
  beforeDestroy () {
    this.resetGameLoop()
    document.removeEventListener('gameStatusChange', this.handleGameStatusChange)
  },
  computed: {
    ...mapState(['stats', 'gameOver', 'paused', 'isSick']),
    isActive () {
      return this.gameOver === false && this.paused === false
    }
  },
  methods: {
    ...mapActions(['decrease']),
    startGameLoop () {
      this.decreaseStats()
    },
    resetGameLoop () {
      clearTimeout(this.loop)
      this.loop = null
    },
    handleGameStatusChange ({isPaused: detail}) {
      if (isPaused) {
        this.resetGameLoop()
      } else {
        this.startGameLoop()
      }
    },
    decreaseStats () {
      const decreaseInterval = 12 * 1000
      this.loop = setTimeout(() => {
        if (this.isActive) {
          this.decrease({ stat: 'water', amount: 3 })
          this.decrease({ stat: 'food', amount: 2 })
          if (this.isSick) {
            this.decrease({ stat: 'health', amount: 2 })
          }

          this.decreaseStats()
        }
      }, decreaseInterval)
    }
  }
}
</script>

<style lang="scss">
  .Stats {
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
