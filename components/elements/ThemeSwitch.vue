<template>
  <div :class="['theme-switch',{'floating d-none d-lg-block': floating, 'mobile': !floating}]" @click="switchColorMode">
    <div class="theme-switch_icons">
      <span v-if="!floating || colorMode === 'light'" :class="{'active': colorMode === 'dark'}"><icon name="moon" /></span>
      <span v-if="!floating || colorMode === 'dark'" :class="{'active': colorMode === 'light'}"><icon name="sun" /></span>
    </div>
  </div>
</template>

<script>
import { ColorModeMixin } from '~/mixins/color-mode';

export default {
  props: {
    floating: Boolean
  },
  mixins: [ColorModeMixin],
  methods: {
    switchColorMode() {
      let colorMode = this.colorMode == 'dark' ? 'light' : 'dark';
      this.setColorMode(colorMode);
      this.$cookies.set('color-mode', colorMode);
      document.documentElement.setAttribute('data-color-mode', this.colorMode);
    }
  }
}
</script>