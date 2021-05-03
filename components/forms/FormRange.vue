<template>
  <div class="form-group">
    <div class="range-slider">
      <vue-slider 
        v-model="rangeValue" 
        :min="min" 
        :max="max" 
        :interval="step" 
        :enable-cross="false"
        :tooltip="'always'"
      >
        <template v-slot:tooltip="{ value }">
          <div class="tooltip">
            {{ value === rangeValue[0] ? $t('from') : $t('to') }}
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
    min: {
      type: Number,
      default: 1000
    },
    max: {
      type: Number,
      default: 500000
    },
    step: {
      type: Number,
      default: 1000
    }
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