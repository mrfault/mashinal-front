<template>
  <div class="color-options row">
    <div
      class="col-2 col-lg-auto mb-2 mb-lg-3 custom-tooltip"
      v-for="(color, index) in colors"
      :key="color.id"
    >
      <span
        :class="[
          'color',
          { selected: isSelected(color.id), contrast: index > 8 },
        ]"
        :style="getStyles(color)"
        @click="selected = color.id"
        v-tooltip="color.name[locale]"
      >
        <span class="sr-only">{{ color.name[locale] }}</span>
        <icon name="check" v-if="isSelected(color.id)" />
      </span>
    </div>
    <div
      class="col-2 col-lg-auto mb-2 mb-lg-3 custom-tooltip"
      key="matt"
      v-if="!hideMatt"
    >
      <span
        :class="['color', 'matt', { selected: matt }]"
        @click="$emit('change-matt', !matt)"
        v-tooltip="$t('matt')"
      >
        <span>{{ $t('matt').slice(0, 3) }}</span>
      </span>
    </div>
  </div>
</template>
<style lang="scss">
.custom-tooltip {
  .tooltip-inner {
    background: #246eb2 !important;
    color: #fff !important;
  }
}
.dark-mode {
  .custom-tooltip {
    .tooltip-inner {
      background: #fff !important;
      color: #000 !important;
    }
  }
}
</style>
<script>
import { mapGetters } from 'vuex'

export default {
  props: {
    value: {},
    matt: Boolean,
    multiple: {
      type: Boolean,
      default: true,
    },
    limit: Number,
    hideMatt: Boolean,
  },
  computed: {
    ...mapGetters(['colors']),

    selected: {
      get() {
        return this.value
      },
      set(color) {
        let value
        if (this.multiple) {
          if (this.isSelected(color)) {
            value = this.value.filter((c) => c !== color)
          } else {
            if (this.limit && this.value.length >= this.limit) return
            value = [...this.value, color]
          }
        } else {
          value = this.isSelected(color) ? '' : color
        }
        this.$emit('input', value)
        this.$emit('change', value)
      },
    },
  },
  methods: {
    getStyles(color) {
      return {
        backgroundColor: color.code,
        borderColor: color.code.includes('#FFFFFF') ? '#D6E4F8' : color.code,
      }
    },
    isSelected(color) {
      if (this.multiple) return this.selected.includes(color)
      return this.selected === color
    },
  },
}
</script>
