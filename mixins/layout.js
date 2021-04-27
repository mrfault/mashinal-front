import { mapGetters, mapActions } from 'vuex';

import { ColorModeMixin } from '~/mixins/color-mode';
import { MessagesMixin } from '~/mixins/messages';

export const LayoutMixin = {
  mixins: [ColorModeMixin, MessagesMixin],
  data() {
    return {
      vhVariableSet: false
    }
  },
  computed: {
    ...mapGetters(['loading', 'messages'])
  },
  methods: {
    ...mapActions(['setLoading','setGridBreakpoint','getMessages','getSavedAnnouncements']),

    async getUserData() {
      if(!this.loggedIn) return;
      if(!this.messages.length) await this.getMessages();
      await this.getSavedAnnouncements();
    },
    handleResize() {
      // update grid breakpoint
      let breakpoint = false;
      ['xs', 'sm', 'md', 'lg', 'xl'].map(name => {
        let value = window.getComputedStyle(document.documentElement).getPropertyValue('--breakpoint-' + name);
        if (window.matchMedia('(min-width: ' + value + ')').matches) {
          breakpoint = name;
        }
      });
      if (breakpoint !== this.breakpoint) {
        this.setGridBreakpoint(breakpoint);
      }
      // set calculated vh variable
      if (this.vhVariableSet && this.isMobileDevice) return;
      let vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty('--vh', `${vh}px`);
      this.vhVariableSet = true;
    },
    handleScroll() {
      let layout = document.querySelector('.layout');
      // header
      let headerEl = document.querySelector('.page-header');
      let menuHeaderEl = document.querySelector('.menu-header');
      [headerEl, menuHeaderEl].map(el => {
        el.classList[window.scrollY > 0 ? 'add' : 'remove']('has-shadow');
      });
      // footer
      let footerEl = document.querySelector('.page-footer');
      let reachedFooter = (window.pageYOffset + window.innerHeight) >= footerEl.offsetTop;
      layout.classList[reachedFooter ? 'add' : 'remove']('reached-footer');
      layout.classList[window.scrollY > 0 ? 'add' : 'remove']('scrolled');
    },
    
  },
  created() {
    this.getUserData();

    this.$nuxt.$on('login', (auth) => {
      this.getUserData();
      if (!auth) {
        // reset store auth data
      }
    });
  },
  mounted() {
    if (this.loggedIn) {
      this.configSocket();
      this.toggleEchoListening(true);
    }

    this.$nuxt.$on('login', (auth) => {
      if (auth) this.configSocket();
      this.toggleEchoListening(auth);
    });

    window.addEventListener('resize', this.handleResize);
    window.addEventListener('resize', this.handleScroll);
    window.addEventListener('scroll', this.handleScroll);
    
    setTimeout(() => {
      this.handleResize();
      this.handleScroll();
      this.pickColorMode();
      this.setLoading(false);
    }, 0);

  },
  beforeDestroy() {
    this.toggleEchoListening(false);

    this.$nuxt.$off('login');

    window.removeEventListener('resize', this.handleResize);
    window.removeEventListener('resize', this.handleScroll);
    window.removeEventListener('scroll', this.handleScroll);
  }
}