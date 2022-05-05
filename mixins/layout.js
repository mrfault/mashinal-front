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
      loginActionKey: '',
      loginInitialForm: {}
    }
  },
  computed: {
    ...mapGetters(['loading','messages','paidStatusData','hideFooter','notifications'])
  },
  methods: {
    ...mapActions(['setLoading','setGridBreakpoint','getMessages','getNotifications','getFavorites','resetSellTokens','resetUserData','updatePaidStatus',
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
      let headerEl = document.querySelector('.header-menu');
      let menuHeaderEl = document.querySelector('.menu-header');
      let promotionEl = document.querySelector('.top-promotion-row');
      promotionEl?.classList[window.scrollY > 0 ? 'add' : 'remove']('d-none');
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
        this.connectEcho('offer-user.'+this.$auth.user.id).listen('OfferMessageSendEvent',({ message })  => {

          this.$store.commit('appendOfferMessage',message)

        })
        this.connectEcho('global-channel.'+this.$auth.user.id).listen('GlobalFrontEndEvent',({ data }) => {
          data.map(value => {
            this.$store.dispatch(value)
          })
        })
      } else if (window.Echo) {
        this.connectEcho('offer-user.'+this.$auth.user.id).stopListening('OfferMessageSendEvent')
        this.connectEcho().stopListening('SendMessage');
      }
    },
    async getUserData() {
      if (!this.loggedIn) return;
      if (!this.messages.length) await this.getMessages();
      if(!this.notifications.length) await this.getNotifications();
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
    },
    // registerSW() {
    //   if ('serviceWorker' in navigator) {
    //     navigator.serviceWorker.register('./sw.js');
    //   }
    // }
  },
  created() {
    //this.getUserData();

    this.$nuxt.$on('login', (auth) => {
      this.getUserData();
      if (!auth) {
        // reset store auth data
        this.resetUserData();
      }
    });
  },
  mounted() {
    this.$nextTick(() => {
      this.configSocket();
      if (this.loggedIn)
        this.toggleEchoListening(true);

      this.$nuxt.$on('login', (auth) => {
        if (auth) this.handleAfterLogin();
        this.toggleEchoListening(auth);
      });

      this.$nuxt.$on('login-popup', (key, form = {}) => {
        if (this.loggedIn) return;
        this.showLoginPopup = true;
        this.loginActionKey = key;
        this.$set(this, 'loginInitialForm', form);
      });

      window.addEventListener('resize', this.handleResize);
      window.addEventListener('resize', this.handleScroll);
      window.addEventListener('scroll', this.handleScroll);
      // window.addEventListener('load', this.registerSW);

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
    });
  },
  beforeDestroy() {
    if (this.loggedIn)
      this.toggleEchoListening(false);

    this.$nuxt.$off(['login', 'login-popup']);

    window.removeEventListener('resize', this.handleResize);
    window.removeEventListener('resize', this.handleScroll);
    window.removeEventListener('scroll', this.handleScroll);
    // window.removeEventListener('load', this.registerSW);
  }
}
