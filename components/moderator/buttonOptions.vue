<template>
  <div class="ma-button-options">
    <div class="row w-100">
      <div
        class="col-6 col-md-4 col-lg-3"
        v-for="(item, index) in list"
        :key="index"
      >
        <div class="ma-button-options__card">
          <div class="ma-button-options__card--image">
            <icon :name="getIcon('engine', index)" />
          </div>

          <p class="ma-button-options__card--title">
            <template v-if="isEngine">
              {{ $t(getName('engines', list[index].engine_id)) }}
            </template>
            <template v-else-if="isTypeofdrive">
              {{ $t(getName('engines', list[index].type_of_drive)) }}
            </template>
            <template v-else-if="isGearbox">
              {{ $t(getName('engines', list[index].type_of_drive)) }}
            </template>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    list: Array,
    selected: Number,
    isEngine: Boolean,
    isTypeofdrive: Boolean,
    isGearbox: Boolean,
  },
  data() {
    return {
      engines: [
        { name: '-', key: '0' },
        { name: 'benzin', key: '1' },
        { name: 'hybrid', key: '2' },
        { name: 'dizel', key: '3' },
        { name: 'gas', key: '4' },
        { name: 'electrical', key: '5' },
        { name: 'gas-turbine', key: '6' },
        { name: 'plug_in_hybrid', key: '7' },
      ],
      type_of_drives: [
        { name: '-', key: 0 },
        { name: 'Rear', key: 1 },
        { name: 'Front', key: 2 },
        { name: 'polnyy', key: 3 },
      ],
    }
  },
  methods: {
    getIcon(key, value) {
      return {
        engine: {
          1: 'fuel-station',
          2: 'battery-charge',
          3: 'diesel',
          4: 'gas',
          5: 'plug',
        },
        type_of_drive: { 1: 'drive', 2: 'drive', 3: 'drive' },
        box: {
          1: 'mechanical',
          2: 'automatic',
          3: 'robot',
          4: 'variator',
          5: 'reductor',
        },
      }[key][value]
    },
    getName(key, index) {
      if (this.isEngine) {
        return this.engines[index].name
      } else if (this.isTypeofdrive) {
        return this.type_of_drives[index].name
      }
    },
  },
}
</script>

<style lang="scss">
.ma-button-options {
  display: flex;
  flex-wrap: wrap;
  width: 100%;
  &__card {
    width: 100%;
    height: 34px;
    display: flex;
    justify-content: center;
    align-items: center;
    border: 1px solid #b6bbd5;
    border-radius: 4px;
    margin-bottom: 20px;
    &--image {
      width: 16px;
      height: 16px;
      margin-right: 9px;
      img {
        width: 100%;
        height: 100%;
        object-fit: contain;
      }
    }
    &--title {
      margin-bottom: 0;
    }
  }
}
</style>
