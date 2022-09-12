import { mapActions } from 'vuex';

export const ColorModeMixin = {
  methods: {
    ...mapActions(['setColorMode']),

    pickColorMode() {
      // decide on which theme to use
      let savedTheme = this.$cookies.get('color-mode');
      let darkMediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      this.setColorMode(savedTheme ||  'light');
      document.documentElement.setAttribute('data-color-mode', this.colorMode);
      // update theme when media query changes
      const handleMediaQuery = (e) => {
        this.$cookies.remove('color-mode');
        this.setColorMode(e.matches ? 'dark' : 'light');
        document.documentElement.setAttribute('data-color-mode', this.colorMode);
      }
      try {
        // try both new and deprecated methods
        if (darkMediaQuery.addEventListener) {
          darkMediaQuery.addEventListener('change', handleMediaQuery);
        } else if (darkMediaQuery.addListener) {
          darkMediaQuery.addListener(handleMediaQuery);
        }
      } catch(error) {
        console.error(error);
      }
    }
  }
}
