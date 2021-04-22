import { mapActions } from 'vuex';

export const ColorThemeMixin = {
  methods: {
    ...mapActions(['toggleColorTheme']),

    pickColorTheme() {
      // decide on which theme to use
      let savedTheme = this.$cookies.get('color-theme');
      let darkMediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      this.toggleColorTheme(savedTheme || (darkMediaQuery.matches ? 'dark' : 'light'));
      document.documentElement.setAttribute('data-theme', this.theme);
      // update theme when media query changes
      const handleMediaQuery = (e) => {
        this.$cookies.remove('color-theme');
        this.toggleColorTheme(e.matches ? 'dark' : 'light');
        document.documentElement.setAttribute('data-theme', this.theme);
      } 
      try {
        // try both new and deprecated methods
        if(darkMediaQuery.addEventListener) {
          darkMediaQuery.addEventListener('change', handleMediaQuery);
        } else if(darkMediaQuery.addListener) {
          darkMediaQuery.addListener(handleMediaQuery);
        } 
      } catch(err) {
        console.error(err);
      }       
    }
  }
}