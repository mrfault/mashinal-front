<template>
  <div :class="['theme-switch',{'floating d-none d-lg-block': floating, 'mobile': !floating}]" @click="switchColorMode">
    <canvas ref="canvas" width="120" height="120"></canvas>
  </div>
</template>

<script>
import { ColorModeMixin } from '~/mixins/color-mode';

export default {
  props: {
    floating: Boolean
  },
  mixins: [ColorModeMixin],
  data() {
    return {
      animation: null
    }
  },
  methods: {
    switchColorMode() {
      let colorMode = this.colorMode == 'dark' ? 'light' : 'dark';
      this.setColorMode(colorMode);
      this.$cookies.set('color-mode', colorMode);
      document.documentElement.setAttribute('data-color-mode', this.colorMode);
      this.updateAnimation();
    },
    initAnimation() {
      this.animation = new this.$rive.Rive({
        src: '/rive/theme-switch.riv',
        canvas: this.$refs.canvas,
        stateMachines: 'state',
        autoplay: true,
        onLoad: this.updateAnimation
      });
    },
    updateAnimation() {
      this.animation?.stateMachineInputs('state')?.forEach(i => {
        switch(i.name) {
          case 'dark':
            i.value = !this.isDarkMode;
            break;
          case 'switch_color':
            i.value = !this.isMobileBreakpoint;
            break;
        }
      });
    }
  },
  watch: {
    breakpoint() {
      this.updateAnimation();
    }
  },
  mounted() {
    this.initAnimation();
  }
}
</script>