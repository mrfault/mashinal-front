<template>
  <div :class="['theme-switch',{'floating d-none d-lg-block': floating, 'mobile': !floating}]" @click="switchColorTheme">
    <div class="theme-switch_icons">
      <span v-if="!floating || theme === 'light'" :class="{'active': theme === 'dark'}"><icon name="moon" /></span>
      <span v-if="!floating || theme === 'dark'" :class="{'active': theme === 'light'}"><icon name="sun" /></span>
    </div>
  </div>
</template>

<script>
import { ColorThemeMixin } from '~/mixins/color-theme';

export default {
  props: {
    floating: Boolean
  },
  mixins: [ColorThemeMixin],
  methods: {
    switchColorTheme() {
      let theme = this.theme == 'dark' ? 'light' : 'dark';
      this.toggleColorTheme(theme);
      this.$cookies.set('color-theme', theme);
      document.documentElement.setAttribute('data-theme', this.theme);
    }
  }
}
</script>