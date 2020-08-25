<template>
  <button class="inventory-item" @click="interact">
    <div :class="`inventory-item__img inventory-item__img--${item.id}`"></div>
    {{ item.name }}
  </button>
</template>

<script>
export default {
  props: {
    item: {
      type: Object,
      required: true,
    },
  },
  methods: {
    interact() {
      this.$emit('interact', this.item)
    },
  },
}
</script>

<style lang="scss" scoped>
.inventory-item {
  min-height: 6.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  padding: 0.5rem 0;
  background: rgba(0, 0, 0, 0.6);
  border: none;
  color: #fff;
  cursor: pointer;
  font-family: monospace;
  font-size: 0.8rem;
  transition: all 0.3s;
  &__img {
    width: 105px;
    height: 60px;
    margin-bottom: 0.3rem;
    background: url('~@/assets/inventory.png') no-repeat;
    &--taser {
      background-position: 0 0;
    }
    &--radio {
      background-position: -105px 0;
    }
    &--water-clean {
      background-position: -210px 0;
    }
    &--pinecone {
      background-position: -315px 0;
    }
    &--bottle {
      background-position: -420px 0;
    }
    &--brokenGlass {
      background-position: -525px 0;
    }
    &--wood {
      background-position: -630px 0;
    }
    &--bucket {
      background-position: -735px 0;
    }
    &--cloth {
      background-position: -840px 0;
    }
    &--solution {
      background-position: -945px 0;
    }
    &--smallKey {
      background-position: -1050px 0;
    }
    &--idCard {
      background-position: -1155px 0;
    }
    &--nuts {
      background-position: -1260px 0;
    }
  }
  &:hover {
    background: rgba(0, 0, 0, 0.8);
  }
}
</style>
