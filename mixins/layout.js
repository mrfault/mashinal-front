import { mapGetters, mapActions } from 'vuex';

import { ColorModeMixin } from '~/mixins/color-mode';
import { SocketMixin } from '~/mixins/socket';
import { MessagesMixin } from '~/mixins/messages';

export const LayoutMixin = {
  mixins: [ColorModeMixin, SocketMixin, MessagesMixin],
  data() {
    return {
      vhVariableSet: false,
      showLoginPopup: false,
      loginActionKey: ''
    }
  },
  computed: {
    ...mapGetters(['loading','loadingKey','messages','paidStatusData','hideFooter'])
  },
  methods: {
    ...mapActions(['setLoading','setGridBreakpoint','getMessages','getFavorites','resetSellTokens','resetUserData','updatePaidStatus',
                   'getNotViewedSavedSearch','getNotViewedFavorites']),

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
      let scrolled = window.scrollY;
      let layout = document.querySelector('.layout');
      // header
      let headerEl = document.querySelector('.page-header');
      let menuHeaderEl = document.querySelector('.menu-header');
      [headerEl, menuHeaderEl].map(el => {
        el?.classList[window.scrollY > 0 ? 'add' : 'remove']('has-shadow');
      });
      // footer
      let footerEl = document.querySelector('.page-footer');
      if (footerEl) {
        this.$nextTick(() => {
          let reachedFooter = (window.pageYOffset + window.innerHeight) >= footerEl.offsetTop;
          let noScroll = document.documentElement.clientHeight === window.innerHeight;
          layout.classList[(scrolled > 0 || noScroll) && reachedFooter ? 'add' : 'remove']('reached-footer');
          layout.classList[scrolled > 0 ? 'add' : 'remove']('scrolled');
        });
      }
    },
    // login
    toggleEchoListening(toggle) {
      if (toggle) {
        this.connectEcho().listen('SendMessage', this.addNewMessage);
      } else if (window.Echo) {
        this.connectEcho().stopListening('SendMessage');
      }
    },
    async getUserData() {
      if (!this.loggedIn) return;
      if (!this.messages.length) await this.getMessages();
      await Promise.all([
        this.getNotViewedSavedSearch(),
        this.getNotViewedFavorites(),
        this.getFavorites()
      ]);
    },
    closeLogin() {
      this.showLoginPopup = false;
      this.loginActionKey = '';
    },
    handleAfterLogin() {
      let key = this.loginActionKey;
      this.closeLogin();
      this.resetSellTokens();
      if (key) this.$nuxt.$emit('after-login', key);
    }
  },
  created() {
    this.getUserData();

    this.$nuxt.$on('login', (auth) => {
      this.getUserData();
      if (!auth) {
        // reset store auth data
        this.resetUserData();
      }
    });
  },
  mounted() {
    this.configSocket();
    if (this.loggedIn) 
      this.toggleEchoListening(true);
      
    this.$nuxt.$on('login', (auth) => {
      if (auth) this.handleAfterLogin();
      this.toggleEchoListening(auth);
    });

    this.$nuxt.$on('login-popup', (key) => {
      if (this.loggedIn) return;
      this.showLoginPopup = true;
      this.loginActionKey = key;
    });

    window.addEventListener('resize', this.handleResize);
    window.addEventListener('resize', this.handleScroll);
    window.addEventListener('scroll', this.handleScroll);
    
    setTimeout(() => {
      this.handleResize();
      this.handleScroll();
      this.pickColorMode();
      // check payment status
      if (['true','false'].includes(this.$route.query.success)) {
        let type = this.$route.query.success === 'true' ? 'success' : 'error';
        this.updatePaidStatus({
          type,
          title: this.$t(`${type}_payment`),
          text: '', //this.$t(`${type}_payment_msg`)
        });
      }
      // strange behavior of loading prop which is not updating 
      // in v-show directive without changing key sometimes
      this.setLoading(false);
    }, 0);

  },
  beforeDestroy() {
    if (this.loggedIn) 
      this.toggleEchoListening(false);

    this.$nuxt.$off(['login', 'login-popup']);

    window.removeEventListener('resize', this.handleResize);
    window.removeEventListener('resize', this.handleScroll);
    window.removeEventListener('scroll', this.handleScroll);
  }
}