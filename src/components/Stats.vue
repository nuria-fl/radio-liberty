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
import { mapState, mapActions, mapMutations } from 'vuex'
import eventBus from '@/utils/eventBus'

export default {
  data() {
    return {
      loop: null,
      icons: {
        health: '❤️',
        water: '💧',
        food: '🍗'
      }
    }
  },
  mounted() {
    document.addEventListener('gameStatusChange', this.handleGameStatusChange)
    document.addEventListener('getHurt', this.handleHurt)
    document.addEventListener('getCured', this.handleCure)
    this.startGameLoop()
  },
  beforeDestroy() {
    this.resetGameLoop()
    document.removeEventListener(
      'gameStatusChange',
      this.handleGameStatusChange
    )
    document.removeEventListener('getHurt', this.handleHurt)
    document.removeEventListener('getCured', this.handleCure)
  },
  computed: {
    ...mapState(['stats', 'gameOver', 'paused', 'isSick']),
    isActive() {
      return this.gameOver === false && this.paused === false
    }
  },
  methods: {
    ...mapMutations(['getCured', 'getSick']),
    ...mapActions(['decrease']),
    startGameLoop() {
      this.decreaseStats()
    },
    resetGameLoop() {
      clearTimeout(this.loop)
      this.loop = null
    },
    handleGameStatusChange({ isPaused: detail }) {
      if (isPaused) {
        this.resetGameLoop()
      } else {
        this.startGameLoop()
      }
    },
    handleHurt() {
      this.decrease({ stat: 'health', amount: 20 })
      this.getSick()
    },
    handleCure() {
      this.getCured()
    },
    decreaseStats() {
      const decreaseInterval = 12 * 1000
      this.loop = setTimeout(() => {
        if (this.isActive) {
          this.decrease({ stat: 'water', amount: 3 })
          this.decrease({ stat: 'food', amount: 2 })
          if (this.isSick) {
            this.decrease({ stat: 'health', amount: 10 })
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
