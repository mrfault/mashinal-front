<template>
  <div class="form-group">
    <div class="range-slider">
      <vue-slider
        v-model="rangeValue"
        :min="min"
        :max="max"
        :data="data || null"
        :interval="step"
        :enable-cross="false"
        :tooltip="'always'"
        :min-range="step"
        :tooltip-placement="['top', 'bottom']"
      >
        <template #tooltip="{ value }">
          <div :class="['tooltip', { 'in-right': max === value, 'in-left': min === value }]">
            <template v-if="tooltipTemplate">{{ tooltipTemplate.replace('{value}', value).replace('day', $readPlural(value, $t('plural_forms_day'), false)) }}</template>
            <template v-else>{{ value === rangeValue[0] ? $t('from') : $t('to') }}</template>
          </div>
        </template>
      </vue-slider>
    </div>
    <slot />
  </div>
</template>

<script>
import VueSlider from 'vue-slider-component/dist-css/vue-slider-component.umd.min.js';

import 'vue-slider-component/dist-css/vue-slider-component.css';
import 'vue-slider-component/theme/default.css';

export default {
  props: {
    value: {},
    data: {},
    min: {
      type: Number,
      default: 0
    },
    max: {
      type: Number,
      default: 100000
    },
    step: {
      type: Number,
      default: 1000
    },
    tooltipTemplate: String
  },
  components: {
    VueSlider
  },
  computed: {
    rangeValue: {
      get() {
        return this.value;
      },
      set(value) {
        this.$emit('input', value);
      }
    }
  }
}
</script>
